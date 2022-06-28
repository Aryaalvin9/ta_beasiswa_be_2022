
--CREATE TABLE public.data_file (
--	id serial4 NOT NULL,
--	id_user int8 NULL,
--	link_sertifikat varchar(250) NULL,
--	tingkat_sertifikat public."tingkat" NULL,
--	status_sertif bool NULL,
--	mimetype text NULL,
--	filename text NULL,
--	CONSTRAINT data_file_pkey PRIMARY KEY (id),
--	CONSTRAINT data_file FOREIGN KEY (id_user) REFERENCES public.tbl_user(id)
--);

--CREATE TABLE public.tbl_admin (
--	id serial4 NOT NULL,
--	username varchar(50) NULL,
--	password_admin varchar(50) NULL,
--	CONSTRAINT tbl_admin_pkey PRIMARY KEY (id)
--);

--CREATE TABLE public.tbl_fakultas (
--	id serial4 NOT NULL,
--	id_prodi int8 NULL,
--	name_fakultas varchar(50) NULL,
--	CONSTRAINT tbl_fakultas_pkey PRIMARY KEY (id),
--	CONSTRAINT tbl_fakultas FOREIGN KEY (id_prodi) REFERENCES public.tbl_prodi(id)
--);

--CREATE TABLE public.tbl_nilai (
--	id serial4 NOT NULL,
--	id_user int8 NULL,
--	nilai_rata_ujiskolah float8 NULL,
--	link_raport text NULL,
--	status_raport bool NULL,
--	mimetype text NULL,
--	filename text NULL,
--	CONSTRAINT tbl_nilai_pkey PRIMARY KEY (id),
--	CONSTRAINT tbl_nilai FOREIGN KEY (id_user) REFERENCES public.tbl_user(id)
--);

--CREATE TABLE public.tbl_priode (
--	tanggal_mulai date NULL,
--	tanggal_akhir date NULL
--);

--CREATE TABLE public.tbl_prodi (
--	id serial4 NOT NULL,
--	name_prodi varchar(50) NULL,
--	CONSTRAINT tbl_prodi_pkey PRIMARY KEY (id)
--);

--CREATE TABLE public.tbl_user (
--	id serial4 NOT NULL,
--	"name" varchar(30) NULL,
--	email varchar(30) NULL,
--	nik varchar(30) NULL,
--	"password" varchar(50) NULL,
--	tgl date NULL,
--	alamat text NULL,
--	asal_sekolah varchar(30) NULL,
--	fakultas_diambil text NULL,
--	pendapatan float8 NULL,
--	pekerjaan_orangtua varchar(50) NULL,
--	jumlah_tanggungan int8 NULL,
--	nomor_tlp varchar(13) NULL,
--	status_lulus varchar(20) NULL,
--	CONSTRAINT tbl_user_pkey PRIMARY KEY (id)
--);