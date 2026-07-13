--
-- PostgreSQL database dump
--

\restrict fRqy6YUiLAG62P3eDuXiX1mB7LUCTnNHHO5QxFXGiyZ4tWzASS9OgSi5wI0GF6c

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-03 11:25:43

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 16919)
-- Name: asiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asiento (
    id_asiento integer NOT NULL,
    id_bus integer,
    numero_asiento integer NOT NULL,
    estado character varying(20) DEFAULT 'disponible'::character varying
);


ALTER TABLE public.asiento OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16918)
-- Name: asiento_id_asiento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asiento_id_asiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asiento_id_asiento_seq OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 227
-- Name: asiento_id_asiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asiento_id_asiento_seq OWNED BY public.asiento.id_asiento;


--
-- TOC entry 230 (class 1259 OID 16934)
-- Name: boleto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boleto (
    id_boleto integer NOT NULL,
    id_usuario integer,
    id_horario integer,
    id_asiento integer,
    codigo_boleto character varying(20) NOT NULL,
    fecha_compra timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    monto_pagado numeric(10,2) NOT NULL,
    metodo_pago character varying(50) NOT NULL,
    estado_boleto character varying(20) DEFAULT 'emitido'::character varying
);


ALTER TABLE public.boleto OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16933)
-- Name: boleto_id_boleto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.boleto_id_boleto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.boleto_id_boleto_seq OWNER TO postgres;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 229
-- Name: boleto_id_boleto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.boleto_id_boleto_seq OWNED BY public.boleto.id_boleto;


--
-- TOC entry 222 (class 1259 OID 16873)
-- Name: bus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bus (
    id_bus integer NOT NULL,
    placa character varying(15) NOT NULL,
    marca character varying(50),
    modelo character varying(50),
    capacidad integer NOT NULL,
    estado character varying(20) DEFAULT 'activo'::character varying
);


ALTER TABLE public.bus OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16872)
-- Name: bus_id_bus_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bus_id_bus_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bus_id_bus_seq OWNER TO postgres;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 221
-- Name: bus_id_bus_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bus_id_bus_seq OWNED BY public.bus.id_bus;


--
-- TOC entry 226 (class 1259 OID 16898)
-- Name: horario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horario (
    id_horario integer NOT NULL,
    id_ruta integer,
    id_bus integer,
    fecha_salida date NOT NULL,
    hora_salida time without time zone NOT NULL,
    estado character varying(20) DEFAULT 'disponible'::character varying
);


ALTER TABLE public.horario OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16897)
-- Name: horario_id_horario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horario_id_horario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horario_id_horario_seq OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 225
-- Name: horario_id_horario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horario_id_horario_seq OWNED BY public.horario.id_horario;


--
-- TOC entry 224 (class 1259 OID 16886)
-- Name: ruta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ruta (
    id_ruta integer NOT NULL,
    origen character varying(100) NOT NULL,
    destino character varying(100) NOT NULL,
    duracion character varying(30),
    precio_base numeric(10,2) NOT NULL,
    estado character varying(20) DEFAULT 'activo'::character varying
);


ALTER TABLE public.ruta OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16885)
-- Name: ruta_id_ruta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ruta_id_ruta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ruta_id_ruta_seq OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 223
-- Name: ruta_id_ruta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ruta_id_ruta_seq OWNED BY public.ruta.id_ruta;


--
-- TOC entry 220 (class 1259 OID 16849)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16848)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 4890 (class 2604 OID 16922)
-- Name: asiento id_asiento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento ALTER COLUMN id_asiento SET DEFAULT nextval('public.asiento_id_asiento_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 16937)
-- Name: boleto id_boleto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto ALTER COLUMN id_boleto SET DEFAULT nextval('public.boleto_id_boleto_seq'::regclass);


--
-- TOC entry 4884 (class 2604 OID 16876)
-- Name: bus id_bus; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus ALTER COLUMN id_bus SET DEFAULT nextval('public.bus_id_bus_seq'::regclass);


--
-- TOC entry 4888 (class 2604 OID 16901)
-- Name: horario id_horario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horario ALTER COLUMN id_horario SET DEFAULT nextval('public.horario_id_horario_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 16889)
-- Name: ruta id_ruta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruta ALTER COLUMN id_ruta SET DEFAULT nextval('public.ruta_id_ruta_seq'::regclass);


--
-- TOC entry 4881 (class 2604 OID 16852)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 5077 (class 0 OID 16919)
-- Dependencies: 228
-- Data for Name: asiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.asiento VALUES (1, 1, 1, 'disponible');
INSERT INTO public.asiento VALUES (2, 1, 2, 'disponible');
INSERT INTO public.asiento VALUES (3, 1, 3, 'disponible');
INSERT INTO public.asiento VALUES (4, 1, 4, 'disponible');


--
-- TOC entry 5079 (class 0 OID 16934)
-- Dependencies: 230
-- Data for Name: boleto; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5071 (class 0 OID 16873)
-- Dependencies: 222
-- Data for Name: bus; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bus VALUES (3, 'CAA-111', 'Volvo', 'Z200', 20, 'activo');
INSERT INTO public.bus VALUES (1, 'ABC-123', 'Mercedes-Benz', 'Paradiso 1800', 40, 'activo');


--
-- TOC entry 5075 (class 0 OID 16898)
-- Dependencies: 226
-- Data for Name: horario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.horario VALUES (1, 1, 1, '2026-06-03', '20:30:00', 'disponible');
INSERT INTO public.horario VALUES (9, 3, 3, '2026-07-10', '22:52:00', 'disponible');
INSERT INTO public.horario VALUES (10, 1, 3, '2026-07-05', '23:12:00', 'disponible');


--
-- TOC entry 5073 (class 0 OID 16886)
-- Dependencies: 224
-- Data for Name: ruta; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ruta VALUES (1, 'Lima', 'Cusco', '21:00 horas', 90.00, 'activo');
INSERT INTO public.ruta VALUES (2, 'Lima', 'Arequipa', '16:00 horas', 75.00, 'activo');
INSERT INTO public.ruta VALUES (3, 'Lima', 'Chiclayo', '13:00 horas', 60.00, 'activo');
INSERT INTO public.ruta VALUES (8, 'Cuzco', 'Lima', '04:00:00', 80.00, 'activo');


--
-- TOC entry 5069 (class 0 OID 16849)
-- Dependencies: 220
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuario VALUES (1, 'DNI', '00000000', 'Admin', 'Del', 'Sistema', '999999999', 'admin@busgo.com', 'admin123', 'admin', 'activo');
INSERT INTO public.usuario VALUES (2, 'DNI', '73613213', 'Juan', 'Pérez', 'Mendoza', '987654321', 'juan.perez@gmail.com', 'cliente123', 'cliente', 'activo');
INSERT INTO public.usuario VALUES (5, 'DNI', '73613212', 'Maritza', 'Fas', 'Fas', '953622221', 'maritza@gmail.com', 'mari123', 'cliente', 'activo');


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 227
-- Name: asiento_id_asiento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asiento_id_asiento_seq', 4, true);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 229
-- Name: boleto_id_boleto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.boleto_id_boleto_seq', 1, false);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 221
-- Name: bus_id_bus_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bus_id_bus_seq', 4, true);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 225
-- Name: horario_id_horario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horario_id_horario_seq', 10, true);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 223
-- Name: ruta_id_ruta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ruta_id_ruta_seq', 9, true);


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 5, true);


--
-- TOC entry 4910 (class 2606 OID 16927)
-- Name: asiento asiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento
    ADD CONSTRAINT asiento_pkey PRIMARY KEY (id_asiento);


--
-- TOC entry 4912 (class 2606 OID 16947)
-- Name: boleto boleto_codigo_boleto_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_codigo_boleto_key UNIQUE (codigo_boleto);


--
-- TOC entry 4914 (class 2606 OID 16945)
-- Name: boleto boleto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_pkey PRIMARY KEY (id_boleto);


--
-- TOC entry 4902 (class 2606 OID 16882)
-- Name: bus bus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus
    ADD CONSTRAINT bus_pkey PRIMARY KEY (id_bus);


--
-- TOC entry 4904 (class 2606 OID 16884)
-- Name: bus bus_placa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus
    ADD CONSTRAINT bus_placa_key UNIQUE (placa);


--
-- TOC entry 4908 (class 2606 OID 16907)
-- Name: horario horario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_pkey PRIMARY KEY (id_horario);


--
-- TOC entry 4906 (class 2606 OID 16896)
-- Name: ruta ruta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ruta
    ADD CONSTRAINT ruta_pkey PRIMARY KEY (id_ruta);


--
-- TOC entry 4896 (class 2606 OID 16871)
-- Name: usuario usuario_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);


--
-- TOC entry 4898 (class 2606 OID 16869)
-- Name: usuario usuario_numero_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_numero_documento_key UNIQUE (numero_documento);


--
-- TOC entry 4900 (class 2606 OID 16867)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4917 (class 2606 OID 16928)
-- Name: asiento asiento_id_bus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento
    ADD CONSTRAINT asiento_id_bus_fkey FOREIGN KEY (id_bus) REFERENCES public.bus(id_bus) ON DELETE CASCADE;


--
-- TOC entry 4918 (class 2606 OID 16958)
-- Name: boleto boleto_id_asiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_id_asiento_fkey FOREIGN KEY (id_asiento) REFERENCES public.asiento(id_asiento) ON DELETE RESTRICT;


--
-- TOC entry 4919 (class 2606 OID 16953)
-- Name: boleto boleto_id_horario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_id_horario_fkey FOREIGN KEY (id_horario) REFERENCES public.horario(id_horario) ON DELETE RESTRICT;


--
-- TOC entry 4920 (class 2606 OID 16948)
-- Name: boleto boleto_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boleto
    ADD CONSTRAINT boleto_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE RESTRICT;


--
-- TOC entry 4915 (class 2606 OID 16913)
-- Name: horario horario_id_bus_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_id_bus_fkey FOREIGN KEY (id_bus) REFERENCES public.bus(id_bus) ON DELETE CASCADE;


--
-- TOC entry 4916 (class 2606 OID 16908)
-- Name: horario horario_id_ruta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_id_ruta_fkey FOREIGN KEY (id_ruta) REFERENCES public.ruta(id_ruta) ON DELETE CASCADE;


-- Completed on 2026-07-03 11:25:44

--
-- PostgreSQL database dump complete
--

\unrestrict fRqy6YUiLAG62P3eDuXiX1mB7LUCTnNHHO5QxFXGiyZ4tWzASS9OgSi5wI0GF6c

