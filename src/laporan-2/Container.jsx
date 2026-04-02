export default function Container({children}) {
    return (
        <div className="card">
            <h2 className="title">
                Pemrograman Framework Lanjutan
            </h2>
            <br/>
            {children}
            <br/>
            <footer className="footer">
                <p>2026 - Politeknik Caltex Riau</p>
            </footer>
        </div>
    )
}