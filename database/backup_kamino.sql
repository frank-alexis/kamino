--
-- PostgreSQL database dump
--

\restrict 44Qciqz4GVEH5qY9hWZyLBr6xlTjMt4SeubrVUgACOX8nUdNH7OnFrQuHsShfMI

-- Dumped from database version 17.10 (Debian 17.10-1.pgdg12+1)
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-16 19:19:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: kamino_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO kamino_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16450)
-- Name: asiento; Type: TABLE; Schema: public; Owner: kamino_user
--

CREATE TABLE public.asiento (
    id_asiento integer NOT NULL,
    id_bus integer,
    numero_asiento integer NOT NULL,
    estado character varying(20) DEFAULT 'disponible'::character varying
);


ALTER TABLE public.asiento OWNER TO kamino_user;

--
-- TOC entry 225 (class 1259 OID 16449)
-- Name: asiento_id_asiento_seq; Type: SEQUENCE; Schema: public; Owner: kamino_user
--

CREATE SEQUENCE public.asiento_id_asiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asiento_id_asiento_seq OWNER TO kamino_user;

--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 225
-- Name: asiento_id_asiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kamino_user
--

ALTER SEQUENCE public.asiento_id_asiento_seq OWNED BY public.asiento.id_asiento;


--
-- TOC entry 227 (class 1259 OID 16462)
-- Name: bloqueo_asiento_id_bloqueo_seq; Type: SEQUENCE; Schema: public; Owner: kamino_user
--

CREATE SEQUENCE public.bloqueo_asiento_id_bloqueo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bloqueo_asiento_id_bloqueo_seq OWNER TO kamino_user;

--
-- TOC entry 228 (class 1259 OID 16463)
-- Name: bloqueo_asiento; Type: TABLE; Schema: public; Owner: kamino_user
--

CREATE TABLE public.bloqueo_asiento (
    id_bloqueo integer DEFAULT nextval('public.bloqueo_asiento_id_bloqueo_seq'::regclass) NOT NULL,
    id_horario integer,
    id_asiento integer,
    usuario_id integer,
    fecha_expiracion timestamp without time zone DEFAULT (now() + '00:05:00'::interval)
);


ALTER TABLE public.bloqueo_asiento OWNER TO kamino_user;

--
-- TOC entry 229 (class 1259 OID 16470)
-- Name: boleto_id_boleto_seq; Type: SEQUENCE; Schema: public; Owner: kamino_user
--

CREATE SEQUENCE public.boleto_id_boleto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.boleto_id_boleto_seq OWNER TO kamino_user;

--
-- TOC entry 230 (class 1259 OID 16471)
-- Name: boleto; Type: TABLE; Schema: public; Owner: kamino_user
--

CREATE TABLE public.boleto (
    id_boleto integer DEFAULT nextval('public.boleto_id_boleto_seq'::regclass) NOT NULL,
    id_usuario integer,
    id_horario integer,
    id_asiento integer,
    codigo_boleto character varying(20),
    fecha_compra timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    monto_pagado numeric(10,2) NOT NULL,
    metodo_pago character varying(50) NOT NULL,
    estado_boleto character varying(20) DEFAULT 'emitido'::character varying
);


ALTER TABLE public.boleto OWNER TO kamino_user;

--
-- TOC entry 218 (class 1259 OID 16399)
-- Name: bus; Type: TABLE; Schema: public; Owner: kamino_user
--

CREATE TABLE public.bus (
    id_bus integer NOT NULL,
    placa character varying(15) NOT NULL,
    marca character varying(50),
    modelo character varying(50),
    capacidad integer NOT NULL,
    estado character varying(20) DEFAULT 'activo'::character varying
);


ALTER TABLE public.bus OWNER TO kamino_user;

--
-- TOC entry 217 (class 1259 OID 16398)
-- Name: bus_id_bus_seq; Type: SEQUENCE; Schema: public; Owner: kamino_user
--

CREATE SEQUENCE public.bus_id_bus_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bus_id_bus_seq OWNER TO kamino_user;

--
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 217
-- Name: bus_id_bus_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kamino_user
--

ALTER SEQUENCE public.bus_id_bus_seq OWNED BY public.bus.id_bus;


--
-- TOC entry 224 (class 1259 OID 16432)
-- Name: horario; Type: TABLE; Schema: public; Owner: kamino_user
--

CREATE TABLE public.horario (
    id_horario integer NOT NULL,
    id_ruta integer,
    id_bus integer,
    fecha_salida date NOT NULL,
    hora_salida time without time zone NOT NULL,
    estado character varying(20) DEFAULT 'disponible'::character varying
);


ALTER TABLE public.horario OWNER TO kamino_user;

--
-- TOC entry 223 (class 1259 OID 16431)
-- Name: horario_id_horario_seq; Type: SEQUENCE; Schema: public; Owner: kamino_user
--

CREATE SEQUENCE public.horario_id_horario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horario_id_horario_seq OWNER TO kamino_user;

--
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 223
-- Name: horario_id_horario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kamino_user
--

ALTER SEQUENCE public.horario_id_horario_seq OWNED BY public.horario.id_horario;


--
-- TOC entry 220 (class 1259 OID 16409)
-- Name: ruta; Type: TABLE; Schema: public; Owner: kamino_user
--

CREATE TABLE public.ruta (
    id_ruta integer NOT NULL,
    origen character varying(100) NOT NULL,
    destino character varying(100) NOT NULL,
    duracion character varying(30),
    precio_base numeric(10,2) NOT NULL,
    estado character varying(20) DEFAULT 'activo'::character varying
);


ALTER TABLE public.ruta OWNER TO kamino_user;

--
-- TOC entry 219 (class 1259 OID 16408)
-- Name: ruta_id_ruta_seq; Type: SEQUENCE; Schema: public; Owner: kamino_user
--

CREATE SEQUENCE public.ruta_id_ruta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ruta_id_ruta_seq OWNER TO kamino_user;

--
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 219
-- Name: ruta_id_ruta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kamino_user
--

ALTER SEQUENCE public.ruta_id_ruta_seq OWNED BY public.ruta.id_ruta;


--
-- TOC entry 222 (class 1259 OID 16417)
-- Name: usuario; Type: TABLE; Schema: public; Owner: kamino_user
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    tipo_documento character varying(20) NOT NULL,
    numero_documento character varying(20) NOT NULL,
    nombres character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100) NOT NULL,
    telefono character varying(20) NOT NULL,
    correo character varying(100) NOT NULL,
    contrasena character varying(255) NOT NULL,
    rol character varying(20) DEFAULT 'cliente'::character varying,
    estado character varying(20) DEFAULT 'activo'::character varying
);


ALTER TABLE public.usuario OWNER TO kamino_user;

--
-- TOC entry 221 (class 1259 OID 16416)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: kamino_user
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO kamino_user;

--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kamino_user
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 3253 (class 2604 OID 16453)
-- Name: asiento id_asiento; Type: DEFAULT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.asiento ALTER COLUMN id_asiento SET DEFAULT nextval('public.asiento_id_asiento_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 16402)
-- Name: bus id_bus; Type: DEFAULT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.bus ALTER COLUMN id_bus SET DEFAULT nextval('public.bus_id_bus_seq'::regclass);


--
-- TOC entry 3251 (class 2604 OID 16435)
-- Name: horario id_horario; Type: DEFAULT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.horario ALTER COLUMN id_horario SET DEFAULT nextval('public.horario_id_horario_seq'::regclass);


--
-- TOC entry 3246 (class 2604 OID 16412)
-- Name: ruta id_ruta; Type: DEFAULT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.ruta ALTER COLUMN id_ruta SET DEFAULT nextval('public.ruta_id_ruta_seq'::regclass);


--
-- TOC entry 3248 (class 2604 OID 16420)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 3445 (class 0 OID 16450)
-- Dependencies: 226
-- Data for Name: asiento; Type: TABLE DATA; Schema: public; Owner: kamino_user
--

COPY public.asiento (id_asiento, id_bus, numero_asiento, estado) FROM stdin;
1	6	1	disponible
2	6	2	disponible
3	6	3	disponible
4	6	4	disponible
5	6	5	disponible
6	6	6	disponible
7	6	7	disponible
8	6	8	disponible
9	6	9	disponible
10	6	10	disponible
11	6	11	disponible
12	6	12	disponible
13	6	13	disponible
14	6	14	disponible
15	6	15	disponible
16	6	16	disponible
17	6	17	disponible
18	6	18	disponible
19	6	19	disponible
20	6	20	disponible
21	6	21	disponible
22	6	22	disponible
23	6	23	disponible
24	6	24	disponible
25	6	25	disponible
26	6	26	disponible
27	6	27	disponible
28	6	28	disponible
29	6	29	disponible
30	6	30	disponible
31	7	1	disponible
32	7	2	disponible
33	7	3	disponible
34	7	4	disponible
35	7	5	disponible
36	7	6	disponible
37	7	7	disponible
38	7	8	disponible
39	7	9	disponible
40	7	10	disponible
41	7	11	disponible
42	7	12	disponible
43	7	13	disponible
44	7	14	disponible
45	7	15	disponible
46	7	16	disponible
47	7	17	disponible
48	7	18	disponible
49	7	19	disponible
50	7	20	disponible
51	7	21	disponible
52	7	22	disponible
53	7	23	disponible
54	7	24	disponible
55	7	25	disponible
56	7	26	disponible
57	7	27	disponible
58	7	28	disponible
59	7	29	disponible
60	7	30	disponible
61	7	31	disponible
62	7	32	disponible
63	7	33	disponible
64	7	34	disponible
65	7	35	disponible
66	7	36	disponible
67	7	37	disponible
68	7	38	disponible
69	7	39	disponible
70	7	40	disponible
71	8	1	disponible
72	8	2	disponible
73	8	3	disponible
74	8	4	disponible
75	8	5	disponible
76	8	6	disponible
77	8	7	disponible
78	8	8	disponible
79	8	9	disponible
80	8	10	disponible
81	8	11	disponible
82	8	12	disponible
83	8	13	disponible
84	8	14	disponible
85	8	15	disponible
86	8	16	disponible
87	8	17	disponible
88	8	18	disponible
89	8	19	disponible
90	8	20	disponible
91	8	21	disponible
92	8	22	disponible
93	8	23	disponible
94	8	24	disponible
95	8	25	disponible
96	8	26	disponible
97	8	27	disponible
98	8	28	disponible
99	8	29	disponible
100	8	30	disponible
101	8	31	disponible
102	8	32	disponible
103	9	1	disponible
104	9	2	disponible
105	9	3	disponible
106	9	4	disponible
107	9	5	disponible
108	9	6	disponible
109	9	7	disponible
110	9	8	disponible
111	9	9	disponible
112	9	10	disponible
113	9	11	disponible
114	9	12	disponible
115	9	13	disponible
116	9	14	disponible
117	9	15	disponible
118	9	16	disponible
119	9	17	disponible
120	9	18	disponible
121	9	19	disponible
122	9	20	disponible
123	9	21	disponible
124	9	22	disponible
125	9	23	disponible
126	9	24	disponible
127	9	25	disponible
128	9	26	disponible
129	9	27	disponible
130	9	28	disponible
131	9	29	disponible
132	9	30	disponible
133	9	31	disponible
134	9	32	disponible
135	10	1	disponible
136	10	2	disponible
137	10	3	disponible
138	10	4	disponible
139	10	5	disponible
140	10	6	disponible
141	10	7	disponible
142	10	8	disponible
143	10	9	disponible
144	10	10	disponible
145	10	11	disponible
146	10	12	disponible
147	10	13	disponible
148	10	14	disponible
149	10	15	disponible
150	10	16	disponible
151	10	17	disponible
152	10	18	disponible
153	10	19	disponible
154	10	20	disponible
155	11	1	disponible
156	11	2	disponible
157	11	3	disponible
158	11	4	disponible
159	11	5	disponible
160	11	6	disponible
161	11	7	disponible
162	11	8	disponible
163	11	9	disponible
164	11	10	disponible
165	11	11	disponible
166	11	12	disponible
167	11	13	disponible
168	11	14	disponible
169	11	15	disponible
170	11	16	disponible
171	11	17	disponible
172	11	18	disponible
173	11	19	disponible
174	11	20	disponible
\.


--
-- TOC entry 3447 (class 0 OID 16463)
-- Dependencies: 228
-- Data for Name: bloqueo_asiento; Type: TABLE DATA; Schema: public; Owner: kamino_user
--

COPY public.bloqueo_asiento (id_bloqueo, id_horario, id_asiento, usuario_id, fecha_expiracion) FROM stdin;
2	10	156	2	2026-07-13 05:19:05.685397
\.


--
-- TOC entry 3449 (class 0 OID 16471)
-- Dependencies: 230
-- Data for Name: boleto; Type: TABLE DATA; Schema: public; Owner: kamino_user
--

COPY public.boleto (id_boleto, id_usuario, id_horario, id_asiento, codigo_boleto, fecha_compra, monto_pagado, metodo_pago, estado_boleto) FROM stdin;
1	2	10	155	BOL-20260713-0001	2026-07-13 04:49:00.278501	85.00	tarjeta	emitido
2	4	10	171	BOL-20260713-0002	2026-07-13 05:33:53.188283	85.00	yape_plin	emitido
3	4	11	135	BOL-20260713-0003	2026-07-13 05:37:32.118786	150.00	tarjeta	emitido
4	1	10	157	BOL-20260713-0004	2026-07-13 06:05:31.892947	85.00	tarjeta	emitido
5	1	10	158	BOL-20260713-0005	2026-07-13 06:13:46.116274	85.00	tarjeta	emitido
6	1	10	156	BOL-20260713-0006	2026-07-13 06:19:27.867672	85.00	tarjeta	emitido
7	1	10	159	BOL-20260713-0007	2026-07-13 06:24:30.01296	85.00	tarjeta	emitido
8	4	11	137	BOL-20260714-0008	2026-07-14 02:22:20.979035	150.00	yape_plin	emitido
9	4	9	104	BOL-20260716-0009	2026-07-16 03:22:28.58533	120.00	yape_plin	emitido
10	4	9	119	BOL-20260717-0010	2026-07-17 00:04:26.676152	120.00	tarjeta	emitido
\.


--
-- TOC entry 3437 (class 0 OID 16399)
-- Dependencies: 218
-- Data for Name: bus; Type: TABLE DATA; Schema: public; Owner: kamino_user
--

COPY public.bus (id_bus, placa, marca, modelo, capacidad, estado) FROM stdin;
6	B1A-101	Mercedes-Benz	Travego	30	activo
7	B2B-202	Scania	Marcopolo G7	40	activo
8	B3C-303	Volvo	9800	32	activo
9	B4D-404	Mercedes-Benz	Tourismo	38	activo
10	B5E-505	Scania	Irizar i8	20	activo
11	CBA-123	Volvo	A200	20	activo
\.


--
-- TOC entry 3443 (class 0 OID 16432)
-- Dependencies: 224
-- Data for Name: horario; Type: TABLE DATA; Schema: public; Owner: kamino_user
--

COPY public.horario (id_horario, id_ruta, id_bus, fecha_salida, hora_salida, estado) FROM stdin;
4	12	10	2026-07-20	12:00:00	disponible
5	11	9	2026-07-21	12:00:00	disponible
6	10	8	2026-07-22	12:00:00	disponible
7	9	7	2026-07-23	12:00:00	disponible
8	8	6	2026-07-24	12:00:00	disponible
9	7	9	2026-07-20	12:00:00	disponible
10	12	11	2026-07-13	23:33:00	disponible
11	8	10	2026-07-20	09:40:00	disponible
\.


--
-- TOC entry 3439 (class 0 OID 16409)
-- Dependencies: 220
-- Data for Name: ruta; Type: TABLE DATA; Schema: public; Owner: kamino_user
--

COPY public.ruta (id_ruta, origen, destino, duracion, precio_base, estado) FROM stdin;
12	Cusco	Arequipa	10:00:00	85.00	activo
11	Trujillo	Lima	09:00:00	70.00	activo
10	Arequipa	Cusco	10:00:00	80.00	activo
9	Lima	Huaraz	08:00:00	60.00	activo
8	Lima	Cusco	22:00:00	150.00	activo
7	Lima	Arequipa	17:00:00	120.00	activo
\.


--
-- TOC entry 3441 (class 0 OID 16417)
-- Dependencies: 222
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: kamino_user
--

COPY public.usuario (id_usuario, tipo_documento, numero_documento, nombres, apellido_paterno, apellido_materno, telefono, correo, contrasena, rol, estado) FROM stdin;
4	DNI	73613212	Alexis	Huaman	Yanque	951647588	frankalexis@gmail.com	$2b$10$FAtKTZx5no6aX775G8.pleGKHrYCZ8tEqqkkeWx9m6qlFByS7R3o2	cliente	activo
1	DNI	00000000	Admin	Del	Sistema	999999999	admin@busgo.com	$2b$10$kBmxfFcjfUvTGGHAPvOwJe4XrudRrpPExnJHR1Nt.KibXo79MNrtm	admin	activo
2	DNI	73613213	Juan	Pérez	Mendoza	987654321	juan.perez@gmail.com	$2b$10$WTSuOZ571OEKgzKdmoQmlOEP0rFLcz769O9S.d4fFenFZy2QniGx6	cliente	activo
5	DNI	1234567	Pedro	Gómez 	López 	963852645	pedro@gmail.com	$2b$10$3tGqwRbe.ij3gqhWcXQ/xuzcNi4PV2TrJH/FkN6ungzxazRLWplxq	cliente	activo
6	DNI	68759426	Maria	Rodriguez	Perez	951647221	maria@gmail.com	$2b$10$nkpuYPpSifUlGWqmTL/ZOeaPUcRuW8yLkEhVG7VLTeR7V9zstF2jm	cliente	activo
\.


--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 225
-- Name: asiento_id_asiento_seq; Type: SEQUENCE SET; Schema: public; Owner: kamino_user
--

SELECT pg_catalog.setval('public.asiento_id_asiento_seq', 174, true);


--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 227
-- Name: bloqueo_asiento_id_bloqueo_seq; Type: SEQUENCE SET; Schema: public; Owner: kamino_user
--

SELECT pg_catalog.setval('public.bloqueo_asiento_id_bloqueo_seq', 15, true);


--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 229
-- Name: boleto_id_boleto_seq; Type: SEQUENCE SET; Schema: public; Owner: kamino_user
--

SELECT pg_catalog.setval('public.boleto_id_boleto_seq', 10, true);


--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 217
-- Name: bus_id_bus_seq; Type: SEQUENCE SET; Schema: public; Owner: kamino_user
--

SELECT pg_catalog.setval('public.bus_id_bus_seq', 11, true);


--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 223
-- Name: horario_id_horario_seq; Type: SEQUENCE SET; Schema: public; Owner: kamino_user
--

SELECT pg_catalog.setval('public.horario_id_horario_seq', 11, true);


--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 219
-- Name: ruta_id_ruta_seq; Type: SEQUENCE SET; Schema: public; Owner: kamino_user
--

SELECT pg_catalog.setval('public.ruta_id_ruta_seq', 14, true);


--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: kamino_user
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 6, true);


--
-- TOC entry 3275 (class 2606 OID 16456)
-- Name: asiento asiento_pkey; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.asiento
    ADD CONSTRAINT asiento_pkey PRIMARY KEY (id_asiento);


--
-- TOC entry 3277 (class 2606 OID 16469)
-- Name: bloqueo_asiento bloqueo_asiento_pkey; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.bloqueo_asiento
    ADD CONSTRAINT bloqueo_asiento_pkey PRIMARY KEY (id_bloqueo);


--
-- TOC entry 3279 (class 2606 OID 16480)
-- Name: boleto boleto_codigo_boleto_key; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_codigo_boleto_key UNIQUE (codigo_boleto);


--
-- TOC entry 3281 (class 2606 OID 16478)
-- Name: boleto boleto_pkey; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_pkey PRIMARY KEY (id_boleto);


--
-- TOC entry 3261 (class 2606 OID 16405)
-- Name: bus bus_pkey; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.bus
    ADD CONSTRAINT bus_pkey PRIMARY KEY (id_bus);


--
-- TOC entry 3263 (class 2606 OID 16407)
-- Name: bus bus_placa_key; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.bus
    ADD CONSTRAINT bus_placa_key UNIQUE (placa);


--
-- TOC entry 3273 (class 2606 OID 16438)
-- Name: horario horario_pkey; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_pkey PRIMARY KEY (id_horario);


--
-- TOC entry 3265 (class 2606 OID 16415)
-- Name: ruta ruta_pkey; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.ruta
    ADD CONSTRAINT ruta_pkey PRIMARY KEY (id_ruta);


--
-- TOC entry 3267 (class 2606 OID 16430)
-- Name: usuario usuario_correo_key; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);


--
-- TOC entry 3269 (class 2606 OID 16428)
-- Name: usuario usuario_numero_documento_key; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_numero_documento_key UNIQUE (numero_documento);


--
-- TOC entry 3271 (class 2606 OID 16426)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 3284 (class 2606 OID 16457)
-- Name: asiento asiento_id_bus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.asiento
    ADD CONSTRAINT asiento_id_bus_fkey FOREIGN KEY (id_bus) REFERENCES public.bus(id_bus) ON DELETE CASCADE;


--
-- TOC entry 3285 (class 2606 OID 16496)
-- Name: bloqueo_asiento bloqueo_asiento_id_asiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.bloqueo_asiento
    ADD CONSTRAINT bloqueo_asiento_id_asiento_fkey FOREIGN KEY (id_asiento) REFERENCES public.asiento(id_asiento) ON DELETE CASCADE;


--
-- TOC entry 3286 (class 2606 OID 16501)
-- Name: bloqueo_asiento bloqueo_asiento_id_horario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.bloqueo_asiento
    ADD CONSTRAINT bloqueo_asiento_id_horario_fkey FOREIGN KEY (id_horario) REFERENCES public.horario(id_horario) ON DELETE CASCADE;


--
-- TOC entry 3287 (class 2606 OID 16506)
-- Name: bloqueo_asiento bloqueo_asiento_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.bloqueo_asiento
    ADD CONSTRAINT bloqueo_asiento_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 3288 (class 2606 OID 16481)
-- Name: boleto boleto_id_asiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_id_asiento_fkey FOREIGN KEY (id_asiento) REFERENCES public.asiento(id_asiento) ON DELETE RESTRICT;


--
-- TOC entry 3289 (class 2606 OID 16486)
-- Name: boleto boleto_id_horario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_id_horario_fkey FOREIGN KEY (id_horario) REFERENCES public.horario(id_horario) ON DELETE RESTRICT;


--
-- TOC entry 3290 (class 2606 OID 16491)
-- Name: boleto boleto_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE RESTRICT;


--
-- TOC entry 3282 (class 2606 OID 16444)
-- Name: horario horario_id_bus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_id_bus_fkey FOREIGN KEY (id_bus) REFERENCES public.bus(id_bus) ON DELETE CASCADE;


--
-- TOC entry 3283 (class 2606 OID 16439)
-- Name: horario horario_id_ruta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kamino_user
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_id_ruta_fkey FOREIGN KEY (id_ruta) REFERENCES public.ruta(id_ruta) ON DELETE CASCADE;


--
-- TOC entry 2075 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO kamino_user;


--
-- TOC entry 2077 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO kamino_user;


--
-- TOC entry 2076 (class 826 OID 16392)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO kamino_user;


--
-- TOC entry 2074 (class 826 OID 16390)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO kamino_user;


-- Completed on 2026-07-16 19:20:01

--
-- PostgreSQL database dump complete
--

\unrestrict 44Qciqz4GVEH5qY9hWZyLBr6xlTjMt4SeubrVUgACOX8nUdNH7OnFrQuHsShfMI

