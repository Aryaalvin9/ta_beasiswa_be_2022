const express = require('express');
const bodyParser = require("body-parser");
const morgan = require('morgan');
var cors = require('cors');
const db = require('./koneksi');
const multer = require('multer');
const path = require('path');
const knex = require('knex');


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(express.static(path.join(__dirname, "assets")));
app.use(morgan('dev'));

app.get('/users', db.getUsers)
app.post('/users/userbyId', db.getUserById)
app.post('/users', db.register)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deletUser)
app.get('/user/lulus', db.userLulus)
app.post('/prodi', db.addprodi)
app.get('/prodi', db.getprodi)
app.post('/prodi/fakultas', db.addfakultas)
app.get('/prodi/fakultas', db.getFakultas)
app.get('/prodi/fakultas/user', db.userbyfakultas)
app.get('/nilai/id', db.getNilaiByIdUser)
app.put('/nilai/uprove', db.aproveFileSertif)
app.post('/users/login', db.Login)
app.post('/admin/login', db.Login_admin)
app.post('/admin/periode', db.addperidoe)
app.get('/admin/periode', db.getperiode)
app.put('/sertif/uprove', db.aproveFileSertif)
app.post('/mainfuction', db.updateDataBanding)
app.post('/mainfuction/post', db.posmantmainFuction)

const db2 = knex({
    client: 'pg',
    connection: {
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '1234',
        posrt: 5432
      },
  });

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './assets/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});


  app.post('/sertif', upload.single('image'), (req, res) => {
    const {id_user, tingkat_sertifikat, status_sertif} = req.body
    const { filename, mimetype } = req.file;
    const link_sertifikat = req.file.path;
  
    db2.insert({
        id_user,
        link_sertifikat,
        tingkat_sertifikat,
        status_sertif,
        mimetype,
        filename,
    })
      .into('data_file')
      .then(() => res.json({ success: true, filename }))
      .catch(err =>
        res.json({ success: false, message: 'upload failed', stack: err.stack }),
      );
  });
  
  // Image Get Routes
  app.get('/sertif', (req, res) => {
    db2.select('*')
      .from('data_file').orderBy('status_sertif', 'asc')
      .then(sertif => {
        if (sertif) {
          return res.status(200).json({
            'status' : true,
            'code': 200,
            'data':sertif,
          });
        }
        return Promise.reject(new Error('Image does not exist'));
      })
      .catch(err =>
        res
          .status(404)
          .json({ success: false, message: 'not found', stack: err.stack }),
      );
  });

  app.get('/sertif/image/:filename', (req, res) => {
    const {filename} = req.params;
    db2.select('*'). from('data_file').where({filename}).then( image => {
      if(image[0]){
        const dirname = path.resolve();
        const fullfilepath = path.join(dirname, image[0].link_sertifikat);
        return res.type(image[0].mimetype).sendFile(fullfilepath);
      }
      return Promise.reject(new Error('Image does not exist'));
    }).catch(err=> res.status(404).json({ success: false, message: 'not found', stack: err.stack }))
  })

  app.post('/nilai', upload.single('image'), (req, res) => {
    const {id_user, nilai_rata_ujiskolah, status_raport} = req.body
    const { filename, mimetype } = req.file;
    const link_raport = req.file.path;
  
    db2.insert({
        id_user,
        link_raport,
        nilai_rata_ujiskolah,
        status_raport,
        mimetype,
        filename,
    })
      .into('tbl_nilai')
      .then(() => res.json({ success: true, filename }))
      .catch(err =>
        res.json({ success: false, message: 'upload failed', stack: err.stack }),
      );
  });

  app.get('/nilai', (req, res) => {
    db2.select('*')
      .from('tbl_nilai').orderBy('status_raport', 'asc')
      .then(raport => {
        if (raport) {
          return res.status(200).json({
            'status' : true,
            'code': 200,
            'data':raport,
          });
        }
        return Promise.reject(new Error('Image does not exist'));
      })
      .catch(err =>
        res
          .status(404)
          .json({ success: false, message: 'not found', stack: err.stack }),
      );
  });

  app.get('/nilai/image/:filename', (req, res) => {
    const {filename} = req.params;
    db2.select('*'). from('tbl_nilai').where({filename}).then( image => {
      if(image[0]){
        const dirname = path.resolve();
        const fullfilepath = path.join(dirname, image[0].link_raport);
        return res.type(image[0].mimetype).sendFile(fullfilepath);
      }
      return Promise.reject(new Error('Image does not exist'));
    }).catch(err=> res.status(404).json({ success: false, message: 'not found', stack: err.stack }))
  })

  app.put('/user/uploadfoto', upload.single('image'), (req, res) => {
    const {id} = req.body
    const { filename, mimetype } = req.file;
    const link_foto = req.file.path;
    
    db2('tbl_nilai')
      .where('id',id).update({
        link_foto,
        mimetype,
        filename,
    })
      .then(() => res.json({ success: true, filename }))
      .catch(err =>
        res.json({ success: false, message: 'upload failed', stack: err.stack }),
      );
  })

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})

