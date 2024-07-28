import headerStyles from "./header.module.css"

export function Header() {
    return (
        <header className={headerStyles.header}>
            <div className={headerStyles.heading}>МОРСКОЙ БОЙ</div>
        </header>
    );
}