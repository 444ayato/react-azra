function Header() {
    return <h1>Biodata Mahasiswa</h1>
}

function Greeting() {
    return <small>Portofolio React - Identitas Diri</small>
}

function FotoProfil() {
    return (
        <div className="center">
            <img 
                src="/img/foto azra.jpeg" 
                alt="Foto Azra"
                className="foto"
            />
        </div>
    )
}

function DataPribadi(props) {
    return (
        <div>
            <hr/>
            <h3>Data Pribadi</h3>
            <p><b>Nama:</b> {props.nama}</p>
            <p><b>NIM:</b> {props.nim}</p>
            <p><b>Tanggal:</b> {props.tanggal}</p>
        </div>
    )
}

function Pendidikan() {
    return (
        <div>
            <hr/>
            <h3>Pendidikan</h3>
            <p>SD - SMP - SMA</p>
            <p>Politeknik Caltex Riau</p>
        </div>
    )
}

function Keahlian() {
    const skill1 = "HTML"
    const skill2 = "CSS"
    const skill3 = "React JS"

    return (
        <div>
            <hr/>
            <h3>Keahlian</h3>
            <p>{skill1}</p>
            <p>{skill2}</p>
            <p>{skill3.toUpperCase()}</p>
        </div>
    )
}

function Kontak() {
    return (
        <div>
            <hr/>
            <h3>Kontak</h3>
            <p>Email: ivana24si@mahasiswa.pcr.ac.id</p>
            <p>Instagram: @azra</p>
        </div>
    )
}

export default function BiodataDiri() {

    const propsData = {
        nama: "Ivana Azra Bawafie",
        nim: "2457301069",
        tanggal: new Date().toLocaleDateString()
    }

    return (
        <div>
            <Header/>
            <Greeting/>
            <FotoProfil/>
            <DataPribadi {...propsData}/>
            <Pendidikan/>
            <Keahlian/>
            <Kontak/>
        </div>
    )
}