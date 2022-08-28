const { response } = require('express')
const { request } = require('express')
const req = require('express/lib/request')
const { password, rows } = require('pg/lib/defaults')
var moment = require('moment')

const date = moment().format('YYYY-MM-DD HH:mm:ss')


const Pool = require('pg').Pool

const pool = new Pool({
    user: 'frskfcxzkbegno',
    host: 'ec2-52-204-157-26.compute-1.amazonaws.com',
    database: 'dfvkafr8auchr1',
    password: 'a76ea0a40f64223e313c3536bb22612f8ab5e7033ca706e6a9d37f8552e18bce',
    port: 5432,
    ssl: { rejectUnauthorized: false }
})


//User Data

const getUsers = (req, resp) => {
    pool.query('SELECT tu.*, tb."niali_rata", tb."tingkat_sertif", tb."jenis_sertifikat", tb."jumlah_sertifikat" FROM tbl_user tu left join tbl_banding tb  on tu.id = tb.id_user ORDER BY id ASC', (error, results) =>
    {
        if(error){
            return resp.status(400).json({"error" : error.message})
        }
        resp.status(200).json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Data berhasil",
            "data"      : results.rows})
    })
}

const getUserById = (request, response) => {
    const {id} = request.body

    pool.query('SELECT tu.*, tb."niali_rata", tb."tingkat_sertif", tb."jenis_sertifikat", tb."jumlah_sertifikat" FROM tbl_user tu left join tbl_banding tb  on tu.id = tb.id_user WHERE tu.id = $1', [id], (error, results)=>
    {
        if(error){
            return resp.status(400).json({"error" : error.message})
        }
        response.status(200).json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Data berhasil",
            "data"      : results.rows
        })
    })
}

const register = (request, response) => {
  const { name, email, password, nomor_tlp } = request.body
  pool.query('INSERT INTO tbl_user (name, email, password, nomor_tlp, status_lulus) VALUES ($1, $2, $3, $4, $5)', [name, email, password, nomor_tlp, 'PROSES'], (error) => {
    if (error) {
        throw error
     
    }
    response.json({
        "code" : 201,
        "status" : true,
        "message" : "Data berhasil di input"
    })
  })
 
}


const updateUser = (req, resp) => {
    const id = parseInt(req.params.id)
    const {nik, tgl_lahir, alamat, asal_sekolah, fakultas_diambil, pendapatan, pkerj_orangtua, jmlh_tangung, no_tlp, jenis_beasiswa, fakultas} = req.body

    pool.query(
        'UPDATE tbl_user SET nik = $1, tgl = $2, alamat = $3, asal_sekolah = $4, fakultas_diambil = $5, pendapatan = $6, pekerjaan_orangtua = $7, jumlah_tanggungan = $8, nomor_tlp = $9, jenis_beasiswa = $11, fakultas = $12 WHERE id = $10', [nik, tgl_lahir, alamat, asal_sekolah, fakultas_diambil, pendapatan, pkerj_orangtua, jmlh_tangung, no_tlp, id, jenis_beasiswa, fakultas],
        (error, results) => {
            if (error) {
                throw error
            }
            resp.json({
                "code" : 200,
                "status" : true,
                "message" : "Data berhasil di update"
            })
            pool.query('select * from tbl_banding where id_user  = $1',[id],(error, results2)=>{
                console.log(results2)
                if(results2.rowCount == 0){
                    addDataBanding(id,fakultas_diambil, pendapatan, jmlh_tangung);
                }
            })
           
        }
    )
}

const deletUser = (req, resp) => {
    const id = parseInt(req.params.id)

    pool.query('DELETE FROM tbl_user WHERE id = $1', [id], (error, results)=>{
        if(error){
            throw error
        }
        resp.status(200).send('User dengan id: ${id}')
    })
}


const userLulus = (request, response) => {
    var status = 'Lolos Seleksi'
    pool.query('SELECT tu.*, tb."niali_rata", tb."tingkat_sertif" FROM tbl_user tu left join tbl_banding tb  on tu.id = tb.id_user where tu.status_lulus = $1', [status], (error, results) => {
        if(error){
            return response.status(400).json({"error": error.message})
        }
        response.status(200).json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Data berhasil",
            "count"     : results.rowCount,
            "data"      : results.rows
        })
    })
}

const userbyfakultas = (request, response) => {
    const {fakultas} = request.body
    pool.query('SELECT * FROM tbl_user where fakultas_diambil = $1', [fakultas], (error, results) => {
        if(error){
            return response.status(400).json({"error": error.message})
        }
        response.status(200).json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Data berhasil",
            "data"      : results.rows
        })
    })
}

//Data Fakultas

const addprodi = (request, response) => {
        const {name_prodi} = request.body
    
        pool.query('INSERT INTO tbl_prodi (name_prodi) VALUES ($1)', [name_prodi], (error) => {
            if (error){
                throw error
            }
            response.json({
                "code" : 201,
                "status" : true,
                "message" : "Data berhasil di input"
            })
        })
    }

    
const addfakultas = (request, response) => {
    const {id_prodi, name_fakultas} = request.body

    pool.query('INSERT INTO tbl_fakultas (id_prodi, name_fakultas) VALUES ($1,$2)', [id_prodi, name_fakultas], (error) => {
        if (error){
            throw error
        }
        response.json({
            "code" : 201,
            "status" : true,
            "message" : "Data berhasil di input"
        })
    })
}

const getprodi =(request, response) => {
    pool.query('SELECT * FROM tbl_prodi ORDER BY id ASC', (error, results) => {
        if(error){
            return response.status(400).json({"error": error.message})
        }
        response.status(200).json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Data berhasil",
            "data"      : results.rows
        })
    })
}

const getFakultas = (request, response) => {
    const {id_prodi} = request.body
    pool.query('SELECT * FROM tbl_fakultas WHERE id_prodi = $1', [id_prodi], (error, results) => {
        if(error){
            return response.status(400).json({"error": error.message})
        }
        response.status(200).json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Data berhasil",
            "data"      : results.rows
        })
    })
}



const getNilaiByIdUser = (request, response) => {
    const {id_user} = request.body

    pool.query('SELECT * FROM tbl_nilai WHERE id_user = $1', [id_user], (error, results) => 
    {
        if(error){
            return response.status(400).json({"error": error.message})
        }
        response.status(200).json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Data berhasil",
            "data"      : results.rows
        })
    })
}

const login = (request, response) => {
    var {email, passwordd} = request.body

    pool.query('SELECT id, password FROM tbl_user WHERE email = $1', [email], (error, results) => 
    {
       
        if(error){
            return response.status(400).json({"error": error.message})
        }
        if(results.rowCount == 0){
            response.json({
                "code"      : 204,
                "status"    : false,
                "message"   : "email tidak terdaftar",
                })   
        }else if([passwordd] == results.rows[0].password){
        response.json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Login Berhasil",
            "id"        : results.rows[0].id
        })
       } else {
        response.json({
            "code"      : 204,
            "status"    : false,
            "message"   : "password Salah",
            })
       }

    })
}

const login_admin = (request, response) => {
    var {username, passwordd} = request.body

    pool.query('SELECT password_admin FROM tbl_admin WHERE username = $1', [username], (error, results) => 
    {
        if(error){
            return response.status(400).json({"error": error.message})
        }
        if(results.rowCount == 0){
            response.status(403).json({
                "code"      : 403,
                "status"    : false,
                "message"   : "email tidak terdaftar",
                })   
        }

       if([passwordd] == results.rows[0].password_admin){
        response.status(200).json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Login Berhasil",
        })
       }

       if([passwordd] != results.rows[0].password_admin){
        response.status(403).json({
            "code"      : 403,
            "status"    : false,
            "message"   : "password Salah",
            })
       }

    })
}

const addperidoe = (request, response) =>{ 
    var {tgl_mulai, tgl_akhir} = request.body
    pool.query('TRUNCATE tbl_priode' )
    pool.query('INSERT INTO tbl_priode (tanggal_mulai, tanggal_akhir) VALUES ($1,$2)', [tgl_mulai, tgl_akhir], (error, results) => {
        if (error){
            throw error
        }
        response.json({
            "code" : 201,
            "status" : true,
            "message" : "Data berhasil di input"
        })
    })
}

const getperiode= (request, response) => {
    pool.query('SELECT * FROM tbl_priode', (error, results) => 
    {
        if(error){
            return response.status(400).json({"error": error.message})
        }
        response.status(200).json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Data berhasil",
            "data"      : results.rows
        })
    })
}


const aproveFileSertif = (request, response) => {
    var{id_user, status_sertif} = request.body
    pool.query('UPDATE data_file SET status_sertif = $2  WHERE id_user = $1',[id_user, status_sertif], (error, results)=>{
        if(error){
            throw error
        }
        response.json({
            "code" : 201,
            "status" : true,
            "message" : "Data berhasil di aprove"
        })

    })
}

const aproveFileNiali = (request, response) => {
    var{id_user, status_raport} = request.body
    pool.query('UPDATE tbl_nilai SET status_raport = $2  WHERE id_user = $1',[id_user, status_raport], (error, results)=>{
        if(error){
            throw error
        }
        response.json({
            "code" : 201,
            "status" : true,
            "message" : "Data berhasil di aprove"
        })

    })
}

const mainFuction = (fakultas) =>{
  
    pool.query('UPDATE tbl_user SET status_lulus = $1 WHERE fakultas_diambil = $2', ["Tidak Lolos", fakultas]);
    pool.query('select tb.id_user, tb.niali_rata as nilai_rata , max(tb.tingkat_sertif) as tingkat_sertif, min(tb.index_kem) as index_kemiskinan, tb.fakultas_diambil from tbl_banding tb where tb.fakultas_diambil = $1 group by tb.id_user, tb.niali_rata, tb.fakultas_diambil, tb.tingkat_sertif, tb.index_kem order by max(tb.niali_rata) desc, max(tb.tingkat_sertif) desc, min(tb.index_kem) limit 1', [fakultas],(error, results) =>{
       console.log(results)
       console.log(fakultas)
      
       pool.query('UPDATE tbl_user SET status_lulus = $1 WHERE id = $2', ["Lolos Seleksi", results.rows[0].id_user], (error,results) => {
           console.log(results.status)
       })
       
    })
}
const posmantmainFuction = (request, response) =>{
    var{fakultas} = request.body;
  
    pool.query('UPDATE tbl_user SET status_lulus = $1 WHERE fakultas_diambil = $2', ["Tidak Lolos", fakultas]);
    pool.query('select tb.id_user, tb.niali_rata as nilai_rata , max(tb.tingkat_sertif) as tingkat_sertif, min(tb.index_kem) as index_kemiskinan, tb.fakultas_diambil from tbl_banding tb where tb.fakultas_diambil = $1 group by tb.id_user, tb.niali_rata, tb.fakultas_diambil, tb.tingkat_sertif, tb.index_kem order by max(tb.niali_rata) desc, max(tb.tingkat_sertif) desc, min(tb.index_kem) limit 1', [fakultas],(error, results) =>{
      
        console.log(fakultas)
        
       pool.query('UPDATE tbl_user SET status_lulus = $1 WHERE id = $2', ["Lolos Seleksi", results.rows[0].id_user], (error,results) => {
           console.log(results.status)
           if(error){
            throw error
        }
        response.json({
            "code" : 201,
            "status" : true,
            "message" : "bisa nih"
        })
       })
       
    })
}

const addDataBanding = (id,fakultas, penghasilan, gaji)=>{
    var indexMis = Math.ceil(penghasilan/gaji)
    pool.query('insert into tbl_banding (id_user, fakultas_diambil, index_kem) values ($1,$2,$3)',[id,fakultas,indexMis],(error,results)=>{
        console.log(results.status)
    })
}

const updateDataBanding = (request, response) => {
    var{id_user, nilai_rata, tingkat_sertif, fakultas, jumlah_sertifikat, jenis_sertifikat} = request.body

    var point_sertifikat = Math.ceil(jumlah_sertifikat * tingkat_sertif);
    console.log(point_sertifikat)
    pool.query('update tbl_banding set niali_rata = $2, tingkat_sertif  = $3, jumlah_sertifikat = $4, jenis_sertifikat = $5, point_sertifikat = $6  where  id_user = $1',[id_user, nilai_rata,tingkat_sertif, jumlah_sertifikat, jenis_sertifikat, point_sertifikat],(error, results)=>{
        if(error){
            throw error
        }
        response.json({
            "code" : 201,
            "status" : true,
            "message" : fakultas
        })
        mainFuction(fakultas)
    })
}

const getJumlahDaftarJurusan = (request, response) => {
    pool.query('select hasil.* from (select count(fakultas_diambil) as total, fakultas_diambil from tbl_user tu group by fakultas_diambil) as hasil', (error, results) => {
        if(error){
            return response.status(400).json({"error": error.message})
        }
        response.status(200).json({
            "code"      : 200,
            "status"    : true,
            "message"   : "Data berhasil",
            "count"     : results.rowCount,
            "data"      : results.rows
        })
    })
}

module.exports = {
    getUsers,
    getUserById,
    register,
    updateUser,
    deletUser,
    userLulus,
    userbyfakultas,
    addprodi,
    getprodi,
    addfakultas,
    getFakultas,
    getNilaiByIdUser,
    login,
    login_admin,
    addperidoe,
    getperiode,
    aproveFileSertif,
    aproveFileNiali,
    updateDataBanding,
    posmantmainFuction,
    getJumlahDaftarJurusan
}