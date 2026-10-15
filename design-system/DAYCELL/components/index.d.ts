import type * as React from 'react';
export interface FrameProps { children?: React.ReactNode; className?: string; style?: React.CSSProperties }
export declare function Frame(props: FrameProps): React.ReactElement;
export interface NavProps { logo?: string; section?: string; links?: string[]; active?: number }
export declare function Nav(props: NavProps): React.ReactElement;
export interface HeroTitleProps { index?: string; title: string; subtitle?: string }
export declare function HeroTitle(props: HeroTitleProps): React.ReactElement;
export interface TagProps { plain?: boolean; children?: React.ReactNode }
export declare function Tag(props: TagProps): React.ReactElement;
export interface PagerProps { count?: number; active?: number; onChange?: (i: number) => void }
export declare function Pager(props: PagerProps): React.ReactElement;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'outline' | 'primary' | 'link'; icon?: 'arrow' | 'search' | 'cart' | 'menu' }
export declare function Button(props: ButtonProps): React.ReactElement;
