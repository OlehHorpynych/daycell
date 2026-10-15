# Минимальный статический сервер для прототипа (без Node/Python).
# Запуск: powershell -ExecutionPolicy Bypass -File serve.ps1 [-Port 5173]
# Открыть: http://localhost:5173/prototype/
param([int]$Port = 5173)

$root = $PSScriptRoot
$types = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'
  '.json'='application/json'; '.svg'='image/svg+xml'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'
  '.png'='image/png'; '.webp'='image/webp'; '.ico'='image/x-icon'; '.md'='text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$Port/"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    $path = [IO.Path]::GetFullPath((Join-Path $root $rel))
    if ((Test-Path $path -PathType Container)) { $path = Join-Path $path 'index.html' }
    $res = $ctx.Response
    if (-not $path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $path -PathType Leaf)) {
      $res.StatusCode = 404
    } else {
      $bytes = [IO.File]::ReadAllBytes($path)
      $ext = [IO.Path]::GetExtension($path).ToLower()
      $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
      $res.Headers.Add('Cache-Control', 'no-store')
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    Write-Host "$($res.StatusCode) /$rel"
    $res.Close()
  }
} finally { $listener.Stop() }
