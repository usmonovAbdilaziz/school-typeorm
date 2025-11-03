--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: buyers_buyerstatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.buyers_buyerstatus_enum AS ENUM (
    'Paid',
    'Pending',
    'Cancelled'
);


ALTER TYPE public.buyers_buyerstatus_enum OWNER TO postgres;

--
-- Name: buyers_interested_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.buyers_interested_enum AS ENUM (
    'ART',
    'LUXURY',
    'COLLECTSIYA',
    'ESTATE',
    'VEHICLES',
    'GADGETS'
);


ALTER TYPE public.buyers_interested_enum OWNER TO postgres;

--
-- Name: lots_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lots_status_enum AS ENUM (
    'pending',
    'playing',
    'played',
    'cancelled'
);


ALTER TYPE public.lots_status_enum OWNER TO postgres;

--
-- Name: lots_tool_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lots_tool_type_enum AS ENUM (
    'ART',
    'LUXURY',
    'COLLECTSIYA',
    'ESTATE',
    'VEHICLES',
    'GADGETS'
);


ALTER TYPE public.lots_tool_type_enum OWNER TO postgres;

--
-- Name: payments_buyerstatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_buyerstatus_enum AS ENUM (
    'Paid',
    'Pending',
    'Cancelled'
);


ALTER TYPE public.payments_buyerstatus_enum OWNER TO postgres;

--
-- Name: payments_currency_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_currency_enum AS ENUM (
    'USD',
    'UZS',
    'EUR',
    'RUB'
);


ALTER TYPE public.payments_currency_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    full_name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: aucsion-resaults; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."aucsion-resaults" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    lot_id uuid NOT NULL,
    buyer_id uuid NOT NULL,
    final_price character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."aucsion-resaults" OWNER TO postgres;

--
-- Name: bit-history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."bit-history" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "lotAction" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "lotId" character varying
);


ALTER TABLE public."bit-history" OWNER TO postgres;

--
-- Name: buyers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buyers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    full_name character varying NOT NULL,
    password character varying NOT NULL,
    hash character varying NOT NULL,
    email character varying(180) NOT NULL,
    "buyerStatus" public.buyers_buyerstatus_enum DEFAULT 'Pending'::public.buyers_buyerstatus_enum NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    interested public.buyers_interested_enum
);


ALTER TABLE public.buyers OWNER TO postgres;

--
-- Name: cards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cards (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    card_number character varying(16) NOT NULL,
    date date NOT NULL,
    cvc character varying(3) NOT NULL,
    buyer_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cards OWNER TO postgres;

--
-- Name: lot_buyers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lot_buyers (
    lot_id uuid NOT NULL,
    buyer_id uuid NOT NULL
);


ALTER TABLE public.lot_buyers OWNER TO postgres;

--
-- Name: lots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lots (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    starting_bit character varying NOT NULL,
    description json NOT NULL,
    tool_name character varying NOT NULL,
    tool_type public.lots_tool_type_enum NOT NULL,
    address character varying NOT NULL,
    status public.lots_status_enum DEFAULT 'pending'::public.lots_status_enum NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "likesCount" integer NOT NULL,
    start_time date NOT NULL,
    admin_id uuid,
    buyer_id character varying,
    image_url json,
    "lotFile" json,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    info character varying
);


ALTER TABLE public.lots OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    buyer_id uuid NOT NULL,
    provider character varying NOT NULL,
    amount integer NOT NULL,
    "providerTransactionId" character varying NOT NULL,
    currency public.payments_currency_enum DEFAULT 'USD'::public.payments_currency_enum NOT NULL,
    "buyerStatus" public.payments_buyerstatus_enum DEFAULT 'Pending'::public.payments_buyerstatus_enum NOT NULL,
    metadata json NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    card_id character varying
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, full_name, email, password, "createdAt", "updatedAt") FROM stdin;
3b3432d1-8f75-4d3b-a9fa-322c479e6285	Abdilaziz	abudev3@gmail.com	$2b$10$myXf42tY47pXHNRHtfWMouKLTyt911yyyPo2UxUnlWmolAviuC7BS	2025-10-20 11:33:38.505809+05	2025-10-20 11:33:38.505809+05
3870509d-7e50-4e76-ba61-e42148a9bb57	Afruzbek	kamoliddin@gmail.com	$2b$10$tnfbRu72WBAZ4uotDdJ4j.pgNjmIaUYnLLevaNlWTpNteshMAM27q	2025-10-28 18:26:36.42877+05	2025-10-28 18:26:36.42877+05
\.


--
-- Data for Name: aucsion-resaults; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."aucsion-resaults" (id, lot_id, buyer_id, final_price, created_at, updated_at) FROM stdin;
dd413cf2-b454-4758-83eb-0df39379f828	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	1000000	2025-10-28 14:38:19.014811	2025-10-28 14:38:19.014811
0dd49398-6be9-4acd-b486-0e56fe83dc2f	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	145200	2025-10-28 14:48:08.110392	2025-10-28 14:48:08.110392
0b934129-49d9-400f-80ef-ac3dca9d66e5	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	145200	2025-10-28 14:48:08.119862	2025-10-28 14:48:08.119862
4d2b9eeb-9a30-4616-8a42-48d4375de8c8	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	145200	2025-10-28 14:48:54.222022	2025-10-28 14:48:54.222022
70091f35-7f3c-45ee-8d75-90867ef45881	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	145200	2025-10-28 14:49:29.056423	2025-10-28 14:49:29.056423
0fcc72bb-f3c0-4d5f-9b1d-0e770b5316e6	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	145200	2025-10-28 14:49:29.132959	2025-10-28 14:49:29.132959
5eab9bf9-233f-42c2-bc62-9e277d83894a	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	145200	2025-10-28 14:50:42.113524	2025-10-28 14:50:42.113524
7af0ba9e-36d4-432a-8fb6-359c0feeefc8	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2796310	2025-10-28 14:51:18.75274	2025-10-28 14:51:18.75274
0c750a61-63f3-479d-a0de-74369b6b9f48	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2796310	2025-10-28 14:51:18.835313	2025-10-28 14:51:18.835313
cf345ef1-52c0-44c3-80b1-cd0118ffea17	2dbcaeef-052f-4ab0-9c71-b8636f47d79f	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	13200	2025-10-28 14:52:13.793875	2025-10-28 14:52:13.793875
22b1f5bc-dcf4-4a16-ad59-fb5536c8480e	2dbcaeef-052f-4ab0-9c71-b8636f47d79f	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	13200	2025-10-28 14:52:13.840223	2025-10-28 14:52:13.840223
a850895e-4303-4e13-b445-c6f0789db14c	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	14520	2025-10-28 14:56:57.396676	2025-10-28 14:56:57.396676
bc027293-ca52-4c64-95a6-cf1b6740b424	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	14520	2025-10-28 14:56:57.495201	2025-10-28 14:56:57.495201
7e27f20c-135c-4aef-89b2-fc882a231cd7	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	14520	2025-10-28 14:57:28.385047	2025-10-28 14:57:28.385047
15ef5059-d0d8-4f55-a83c-8c9511e89ac1	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	14520	2025-10-28 14:58:41.522679	2025-10-28 14:58:41.522679
f9460188-a96b-42b3-9b44-998636ff0717	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	13200	2025-10-28 15:00:20.103641	2025-10-28 15:00:20.103641
af026767-07dc-433c-909a-87462bb292e4	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	13200	2025-10-28 15:00:20.242982	2025-10-28 15:00:20.242982
c086b7ea-03a9-42b2-b846-e7d435346c82	6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	13200	2025-10-28 15:02:51.037127	2025-10-28 15:02:51.037127
ee5da6ca-88f7-479d-9f05-d4fb42c6e37a	6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	13200	2025-10-28 15:02:51.148288	2025-10-28 15:02:51.148288
7d0f2a45-888f-484d-9970-3d60a145a335	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	89a16887-cb47-4f01-8105-8b5a00f797a4	81839	2025-10-28 15:21:38.44039	2025-10-28 15:21:38.44039
31fe3348-7566-46b0-9f5a-ffa43903dfa6	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	89a16887-cb47-4f01-8105-8b5a00f797a4	81839	2025-10-28 15:21:38.439373	2025-10-28 15:21:38.439373
f96487d3-4a81-478f-9660-c8d32aa67366	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	89a16887-cb47-4f01-8105-8b5a00f797a4	25091	2025-10-28 15:25:29.341333	2025-10-28 15:25:29.341333
43109ceb-db79-4805-9915-5a7b8b9ac244	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	89a16887-cb47-4f01-8105-8b5a00f797a4	25091	2025-10-28 15:25:29.342511	2025-10-28 15:25:29.342511
f1a2a4af-4a6c-4764-9f84-56514937d544	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	19008	2025-10-28 15:28:13.087024	2025-10-28 15:28:13.087024
b56d79d6-d268-44d4-8759-85329bb72817	e7525e5a-02e7-4a0c-8879-5af8daee5ca9	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	19008	2025-10-28 15:28:13.2493	2025-10-28 15:28:13.2493
432ad995-1ea0-4ebf-937e-9597be582a98	6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	89a16887-cb47-4f01-8105-8b5a00f797a4	17424	2025-10-28 15:28:58.080294	2025-10-28 15:28:58.080294
d7d92076-a1cf-412a-9595-4468f4cf1da6	6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	89a16887-cb47-4f01-8105-8b5a00f797a4	17424	2025-10-28 15:28:58.087623	2025-10-28 15:28:58.087623
a855aa8d-ee87-4b26-ac5b-c43c83c6148f	6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	89a16887-cb47-4f01-8105-8b5a00f797a4	15972	2025-10-28 15:29:23.644564	2025-10-28 15:29:23.644564
950425c9-acb4-405e-bbd4-b30343aa2a45	6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	89a16887-cb47-4f01-8105-8b5a00f797a4	15972	2025-10-28 15:29:23.748643	2025-10-28 15:29:23.748643
5b3b2bfc-85fa-436e-8690-51a0e817be7e	6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	19326	2025-10-28 15:30:04.245438	2025-10-28 15:30:04.245438
1c39edb8-f372-4f8b-b40c-36eafd251056	6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	19326	2025-10-28 15:30:04.41635	2025-10-28 15:30:04.41635
001b5482-07c3-4640-b210-ef7b52c70db6	820afabe-94b2-4dbb-be70-095010428b1d	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	159720	2025-10-28 15:33:05.890307	2025-10-28 15:33:05.890307
f34960bf-f99a-4d81-9688-66ecaf9715c7	820afabe-94b2-4dbb-be70-095010428b1d	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	159720	2025-10-28 15:33:05.892357	2025-10-28 15:33:05.892357
667a6ccc-f980-4ba5-8f62-2bfb48a9bb57	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	175692	2025-10-28 15:38:13.206172	2025-10-28 15:38:13.206172
31c06d98-3375-4565-8733-b65205a5448f	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	175692	2025-10-28 15:38:13.304082	2025-10-28 15:38:13.304082
4d92ab4c-407d-4997-a8a0-14b153d2defc	820afabe-94b2-4dbb-be70-095010428b1d	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	174240	2025-10-28 15:38:56.280093	2025-10-28 15:38:56.280093
92137311-9d84-46ed-8e1d-7ea845ba405f	820afabe-94b2-4dbb-be70-095010428b1d	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	174240	2025-10-28 15:38:56.289909	2025-10-28 15:38:56.289909
b59beade-03a1-4baa-93df-e00363d6774a	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	209088	2025-10-28 15:40:56.609499	2025-10-28 15:40:56.609499
e45e617c-9ce2-4ceb-89f6-e3e495cb1731	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	209088	2025-10-28 15:40:56.740504	2025-10-28 15:40:56.740504
98d04755-28c9-4981-b837-443e07e0b1dd	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	252997	2025-10-28 15:42:10.552684	2025-10-28 15:42:10.552684
26bd3cc7-b987-4988-a8dc-0d4dcc82f071	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	252997	2025-10-28 15:42:10.656751	2025-10-28 15:42:10.656751
00148916-0e57-4740-b9aa-3b481960998c	739452b7-32a2-4b6b-b528-100fdd965fcf	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	3050520	2025-10-28 16:02:48.918312	2025-10-28 16:02:48.918312
77c20aec-1dfa-4630-bffe-11249ea297b2	739452b7-32a2-4b6b-b528-100fdd965fcf	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	3050520	2025-10-28 16:02:48.928009	2025-10-28 16:02:48.928009
ac22fc40-d19e-468b-a33a-0505c77c7ed9	739452b7-32a2-4b6b-b528-100fdd965fcf	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	2542100	2025-10-28 16:04:12.155423	2025-10-28 16:04:12.155423
a8546acb-a5ef-404a-932d-613f82d16cad	739452b7-32a2-4b6b-b528-100fdd965fcf	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	2542100	2025-10-28 16:04:12.170525	2025-10-28 16:04:12.170525
da94b10a-a32d-4140-95e6-269a43ca2c9c	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2542100	2025-10-28 16:06:08.610299	2025-10-28 16:06:08.610299
ea336b0b-8391-4830-882e-bf503c28e6d8	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2542100	2025-10-28 16:06:08.991494	2025-10-28 16:06:08.991494
1167ce68-2bbc-4565-84f4-39d4b9987fd7	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2796310	2025-10-28 16:07:11.580812	2025-10-28 16:07:11.580812
d7b641f4-dc9f-4ebc-8b52-672008f33336	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2796310	2025-10-28 16:07:11.781263	2025-10-28 16:07:11.781263
49e822f1-79a1-4609-99a7-a758ca6df546	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2773200	2025-10-28 16:10:46.554103	2025-10-28 16:10:46.554103
5cba832c-50f7-4594-8764-ccf9af52ae68	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2773200	2025-10-28 16:10:46.777568	2025-10-28 16:10:46.777568
02a95046-a50e-4805-b641-f72a4a0ad637	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2542100	2025-10-28 16:16:51.570362	2025-10-28 16:16:51.570362
698821aa-f413-4417-8684-180f419217e1	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2542100	2025-10-28 16:16:51.881815	2025-10-28 16:16:51.881815
ef913496-c787-4373-b627-bdc363b98175	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2542100	2025-10-28 16:17:46.657887	2025-10-28 16:17:46.657887
067857c8-9e8d-4c39-86ea-a00ee0abf0b8	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2542100	2025-10-28 16:17:47.002435	2025-10-28 16:17:47.002435
8e2083d8-f7ea-40f8-b3fc-5cb1af55c2da	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	145200	2025-10-28 16:20:17.099892	2025-10-28 16:20:17.099892
6a0608cb-4b9a-466b-a35e-e46532c669ee	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	145200	2025-10-28 16:20:17.519663	2025-10-28 16:20:17.519663
fa8a9855-4453-45c2-bb45-f00ff3c1092f	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	158400	2025-10-28 16:20:49.05763	2025-10-28 16:20:49.05763
c82b61f6-7a14-4ebf-ba03-2a06a03d2ee6	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	158400	2025-10-28 16:20:49.237114	2025-10-28 16:20:49.237114
d3f5bb6d-8471-47b5-913a-11ae7b2ababd	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	298995	2025-10-28 16:24:25.03139	2025-10-28 16:24:25.03139
c16a3c8f-f892-4155-9262-4a4bd23d7b6b	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	298995	2025-10-28 16:24:25.189469	2025-10-28 16:24:25.189469
affa235b-68c4-4737-afd3-12515628988c	820afabe-94b2-4dbb-be70-095010428b1d	89a16887-cb47-4f01-8105-8b5a00f797a4	132000	2025-10-28 16:24:51.621014	2025-10-28 16:24:51.621014
bcd76679-a66a-45ef-80a3-76724fb037e5	820afabe-94b2-4dbb-be70-095010428b1d	89a16887-cb47-4f01-8105-8b5a00f797a4	132000	2025-10-28 16:24:51.612042	2025-10-28 16:24:51.612042
579052e1-4ab4-4204-8b6c-42ec918ff255	739452b7-32a2-4b6b-b528-100fdd965fcf	89a16887-cb47-4f01-8105-8b5a00f797a4	3660624	2025-10-28 16:25:22.598253	2025-10-28 16:25:22.598253
8dfa37d7-a06b-42d9-8db0-ea7b8cbd79a0	739452b7-32a2-4b6b-b528-100fdd965fcf	89a16887-cb47-4f01-8105-8b5a00f797a4	3660624	2025-10-28 16:25:22.603681	2025-10-28 16:25:22.603681
127304c4-24ad-476c-9bfd-1e954f44ca0f	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	271814	2025-10-29 22:49:08.851623	2025-10-29 22:49:08.851623
8a771195-2906-4f1d-a6a6-77886256f78b	820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	271814	2025-10-29 22:49:09.148883	2025-10-29 22:49:09.148883
868b7fa3-3e36-4edd-891f-a99d796778c5	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2773200	2025-10-29 22:51:17.113166	2025-10-29 22:51:17.113166
8480cdba-f17c-45b3-b9f4-58b8dcbe8cb2	739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2773200	2025-10-29 22:51:17.397606	2025-10-29 22:51:17.397606
c9763dae-e58a-4ef8-80e2-8adee65677bc	6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	13200	2025-10-30 16:35:47.82602	2025-10-30 16:35:47.82602
f4df247e-afdf-45a3-b495-b7b6429bca45	6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	13200	2025-10-30 16:35:48.301528	2025-10-30 16:35:48.301528
\.


--
-- Data for Name: bit-history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."bit-history" (id, "createdAt", "lotAction", "lotId") FROM stdin;
135416bd-bea2-44c7-9fae-18ce155ddbac	2025-10-22 19:56:14.420085	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T14:56:14.413Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:55:48.229Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T15:04:00.792Z"}, {"amount": 14520, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T15:05:21.059Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:52:09.691Z"}]	\N
d59f7f88-2b1e-4d60-9a13-adebaa483034	2025-10-22 19:57:13.487734	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T14:57:13.486Z"}]	\N
f65afd99-1929-4434-b998-62d56a366708	2025-10-22 19:57:21.062727	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T14:57:21.061Z"}]	\N
4720a818-8034-4ac7-ad42-1484d59dee69	2025-10-22 19:57:43.051829	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T14:57:43.050Z"}]	\N
0f06f9bd-0bda-4385-bee8-794f0edbc877	2025-10-22 19:58:15.027495	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T14:58:15.025Z"}]	\N
2d85717d-407a-41cd-b02e-bf003a57d566	2025-10-22 19:58:17.888953	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T14:58:17.887Z"}]	\N
0583613a-18b4-4e58-b10a-76d12789509c	2025-10-22 19:58:29.27921	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T14:58:29.278Z"}]	\N
aefb25ae-6f1c-4f27-8744-399569ea6ee9	2025-10-22 20:00:30.030852	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T15:00:30.030Z"}]	\N
8961217f-d65f-4b25-a114-8e3d1738a4f7	2025-10-22 20:00:51.419945	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T15:00:51.418Z"}]	\N
e1a2c88f-c97f-4381-bdee-20787fa3041c	2025-10-22 20:02:33.202746	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T15:02:33.201Z"}]	\N
c59bfdd6-0b22-4c45-b606-cc9c0cf4a23d	2025-10-22 20:03:23.14706	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T15:03:23.146Z"}]	\N
809ac8a9-cd0c-47a0-aa25-0bccf61dd109	2025-10-22 20:03:49.901614	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T15:03:49.901Z"}]	\N
8efea61d-5274-496c-85cc-d0395b95f739	2025-10-22 20:03:51.693521	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T15:03:51.692Z"}]	\N
692996fb-f294-46bd-8aca-60d6887b9702	2025-10-22 20:03:54.936369	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T15:03:54.935Z"}]	\N
29e17780-368a-4f00-9195-389ee70dfc7b	2025-10-22 20:03:59.416853	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T15:03:59.416Z"}]	\N
90e1a8b1-344c-4e42-9134-69ced73b76ce	2025-10-22 20:04:52.130299	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T15:04:52.129Z"}]	\N
b72e5134-049a-4935-b411-f546eb19e136	2025-10-22 20:05:23.238859	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-22T15:05:23.237Z"}]	\N
e4f3f91d-17a2-4900-97bf-cb4f8b552677	2025-10-24 14:31:32.628053	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T09:31:32.618Z"}]	\N
3e236a8b-cd7b-41db-b094-01b72ef06d11	2025-10-24 14:44:10.669294	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T09:44:10.668Z"}]	\N
57cae961-c0db-4dda-8f54-ba8a0c630136	2025-10-24 14:45:08.758465	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T09:45:08.757Z"}]	\N
a2e0e928-54b3-4d4d-9b4b-1dfe68053fa4	2025-10-24 14:47:50.074581	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T09:47:50.072Z"}]	\N
fff3c9db-3cd0-4b04-8c3f-80e999bf9127	2025-10-24 14:58:16.73718	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T09:58:16.734Z"}]	\N
19bf466c-f039-4b02-9f49-8fe4fda9fa59	2025-10-24 14:58:21.309972	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T09:58:21.309Z"}]	\N
d50e4902-dda4-4b4c-b782-e97d02d0660d	2025-10-24 14:58:33.196104	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T09:58:33.195Z"}]	\N
00455365-2a5c-414b-97bf-d705e8fa42bc	2025-10-24 14:59:08.503523	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T09:59:08.502Z"}]	\N
ce9ec771-dae4-495f-93b8-84afd42e436c	2025-10-24 14:59:33.723562	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T09:59:33.722Z"}]	\N
14077504-b596-4536-ac7a-94d511956bfa	2025-10-24 15:00:32.491282	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T10:00:32.490Z"}]	\N
1ae54be8-dd62-4f18-a140-cc1b9ddd19d5	2025-10-24 15:00:49.940128	[{"amount": 12000, "buyerId": "", "actionTime": "2025-10-24T10:00:49.938Z"}]	\N
9669afab-bf5c-4ba0-a2d3-2c7ced07344a	2025-10-27 17:31:42.404276	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:42.403Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:48:09.293Z"}, {"amount": 15840, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:28:09.521Z"}, {"amount": 19008, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:28:11.249Z"}]	\N
33d03ecb-8363-45d9-be5e-d0864afbcef2	2025-10-27 17:31:43.418406	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:43.417Z"}, {"amount": 15840, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:52:49.361Z"}]	\N
92d8700a-af49-4331-b211-fac7685a6e31	2025-10-27 17:31:44.419347	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:44.418Z"}, {"amount": 22810, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:54:06.636Z"}]	\N
f72564a3-d908-4511-a964-d8d4ae8fa484	2025-10-27 17:31:45.427021	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:45.426Z"}, {"amount": 27600, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:04:41.802Z"}]	\N
48fe6bc3-eeeb-4f13-b655-b1e59be15cb7	2025-10-27 17:31:45.505179	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:45.504Z"}, {"amount": 33120, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:07:13.012Z"}]	\N
d40899e8-ab33-4499-a458-ef720653d74f	2025-10-27 17:31:46.453817	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:46.453Z"}, {"amount": 14520, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:19:51.517Z"}]	\N
5181e5e7-2b67-4913-b216-eba88b63609f	2025-10-27 17:31:47.464331	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:47.463Z"}, {"amount": 17569, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:21:12.356Z"}]	\N
d3f244c2-74ff-4d8d-8672-526811187394	2025-10-27 17:31:48.453619	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:48.452Z"}, {"amount": 19326, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:23:18.731Z"}]	\N
1f46fc2d-c472-4c33-9264-b39f32e3b6c6	2025-10-27 17:31:49.462776	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:49.462Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:26:29.585Z"}]	\N
e842bf9f-1e57-4255-b27c-3174c90f2a19	2025-10-27 17:31:50.468549	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:50.467Z"}, {"amount": 14520, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:26:50.902Z"}]	\N
94ee4322-2223-484c-84da-9135021a4142	2025-10-27 17:31:50.470145	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:50.469Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:56:49.751Z"}]	\N
012b74ee-14ed-4cff-8c9d-3f715de50bd1	2025-10-27 17:31:51.475449	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:51.474Z"}]	\N
3f2247fa-6194-486e-97eb-57c6bcd6ce44	2025-10-27 17:31:52.48435	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:52.483Z"}]	\N
d0f0b33c-f99b-4d34-b806-d72b27f28f36	2025-10-27 17:31:53.497279	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:53.496Z"}]	\N
110c121a-6db2-4752-9480-674b65678711	2025-10-27 17:31:54.511463	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:54.510Z"}]	\N
c697b922-ef84-4f58-a19e-abe24a95c179	2025-10-27 17:31:52.494666	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:52.493Z"}]	\N
cc358c29-10d6-4392-bfed-cf3bc7dbfe2e	2025-10-27 17:31:53.496452	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:53.495Z"}]	\N
0c809a2f-59b7-43b1-b018-f99d51e46f03	2025-10-27 17:31:54.518414	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:54.517Z"}]	\N
c015b925-ab59-416e-bdd5-367cb94d2145	2025-10-27 17:32:53.056825	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:32:53.056Z"}]	\N
12b5d811-11a5-4677-8708-28133e89934d	2025-10-27 17:32:53.070577	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:32:53.070Z"}]	\N
89631e54-d3f4-455a-8112-9a9b46fcf74b	2025-10-27 17:32:53.071066	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:32:53.070Z"}]	\N
49609803-ed6a-4da1-954e-6fc9df00a584	2025-10-27 17:32:53.090588	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:32:53.090Z"}]	\N
0e47ad5c-abf8-4493-8c16-dc37bcda237a	2025-10-27 17:33:16.429268	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.425Z"}]	\N
05525cc9-1442-4039-a68b-8595c55b6bfa	2025-10-27 17:33:16.594897	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.544Z"}]	\N
c78cb241-908f-4174-a994-c4919a3ba727	2025-10-27 17:33:16.595788	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.550Z"}]	\N
84e95314-6976-4ead-9da0-9ca72605c588	2025-10-27 17:33:16.597318	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.557Z"}]	\N
d497f80c-f6f5-4e24-8938-4a424fcc7dd3	2025-10-27 17:33:16.601338	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.572Z"}]	\N
0f195fcd-5168-49ca-9ea4-92862ed96179	2025-10-27 17:33:16.606251	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.586Z"}]	\N
b279a90f-a2dc-4b6e-94f0-477e2bb6444d	2025-10-27 17:33:16.605144	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.582Z"}]	\N
5daac403-960b-444c-95c0-54a439d11750	2025-10-27 17:33:16.604646	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.582Z"}]	\N
f5c057c4-7520-4058-b4b4-dc5ff0ee6de2	2025-10-27 17:33:16.605595	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.584Z"}]	\N
8c35ea0c-6263-4356-9cf9-483d3c7d3d04	2025-10-27 17:33:16.610299	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.587Z"}]	\N
98dab39c-01f3-4544-acaf-7dd04ae6136e	2025-10-27 17:33:16.612442	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.588Z"}]	\N
3bb8da2d-d490-4784-be7c-7f98bd0bbc39	2025-10-27 17:33:16.615303	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.593Z"}]	\N
88d9a7d7-8648-4d8f-b587-c22d6cbe9585	2025-10-27 17:33:16.610799	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.587Z"}]	\N
babd5bab-d682-49c9-bd34-e47aa2086acc	2025-10-27 17:33:16.611616	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.588Z"}]	\N
98ad675d-8a1e-4655-98ee-a66ccb7dbd68	2025-10-27 17:33:16.617506	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.593Z"}]	\N
06b3661c-8605-42f0-827f-82ec78149224	2025-10-27 17:33:16.619794	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.593Z"}]	\N
512d7d6d-8b1f-4c25-90e7-ccc6e664f6ef	2025-10-27 17:33:16.621341	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.594Z"}]	\N
5fef10e4-7f4f-48b2-9b1c-5af78a1e6ea2	2025-10-27 17:33:16.621706	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.594Z"}]	\N
0453573a-2e64-47bb-9863-6b58dfe18316	2025-10-27 17:33:16.622091	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.595Z"}]	\N
95abd746-22ef-4fb9-a390-15b65d0d8719	2025-10-27 17:33:16.622846	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.596Z"}]	\N
65007ec5-5c57-4aa1-92f7-8b1666c2199a	2025-10-27 17:33:16.62497	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.597Z"}]	\N
3f63d413-2429-4020-a641-adf5a52941c7	2025-10-27 17:33:16.62733	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.597Z"}]	\N
c90ad580-9804-45c0-be59-a87765b17de5	2025-10-27 17:33:16.630864	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.601Z"}]	\N
e1db8e9d-406d-4d1b-b71b-5ac70eb2fe96	2025-10-27 17:33:16.631128	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.602Z"}]	\N
6c81e954-5588-4196-a505-8043848f03fe	2025-10-27 17:33:16.630621	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.600Z"}]	\N
3ccd1a37-0365-4c70-a334-2a4cb8ccd35f	2025-10-27 17:33:16.634294	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.604Z"}]	\N
b871de61-0fa7-4218-8515-c1883b1fdd37	2025-10-27 17:33:16.636969	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.604Z"}]	\N
8a99465e-71de-4357-9554-5eb96c824ead	2025-10-27 17:33:16.637425	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.605Z"}]	\N
30fc029e-81f4-457a-bd09-ab53434ef468	2025-10-27 17:33:16.638391	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.605Z"}]	\N
07b3b9f8-748a-48e4-a8bb-cc7c128c2b82	2025-10-27 17:33:16.639158	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.610Z"}]	\N
17b4afd6-66fb-48ac-875e-9b46901957f3	2025-10-27 17:33:16.64162	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:16.611Z"}]	\N
6b5b6922-c796-4b21-b6d2-7b8ff839b3ca	2025-10-27 17:33:19.147836	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:19.146Z"}]	\N
1d330af1-4d5c-4ff3-8af1-8d6e3ad91256	2025-10-27 17:33:19.172909	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:19.172Z"}]	\N
172aa0cd-cd99-47ff-82e3-9f4d13038614	2025-10-27 17:33:19.183233	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:19.182Z"}]	\N
fbe0398d-0be5-4314-a73f-f813e43d54a7	2025-10-27 17:33:19.212878	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:19.211Z"}]	\N
0f8636f5-4650-4f33-a935-828c23083c7b	2025-10-27 17:33:28.63926	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:28.638Z"}]	\N
0410891c-1f1c-40bb-9827-b7212a161f96	2025-10-27 17:33:28.724876	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:28.723Z"}]	\N
1a6f9b75-93c7-426f-b0f8-3956b4213e72	2025-10-27 17:33:19.151474	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:19.150Z"}]	\N
d964da0e-0181-4086-b11d-b6b00b9cb848	2025-10-27 17:33:19.171799	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:19.171Z"}]	\N
2df18084-9d89-46e8-af45-addf1beaf553	2025-10-27 17:33:19.2174	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:19.216Z"}]	\N
c401ed5a-2c5f-48c9-9dd0-9731d37942cc	2025-10-27 17:33:28.730237	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:28.729Z"}]	\N
1c232ffe-d4cb-4ebd-ba17-84c542694e5c	2025-10-27 17:33:28.760097	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:28.758Z"}]	\N
aba1dea7-b2e0-4101-a049-5e0900a38b00	2025-10-27 17:33:29.693109	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:29.691Z"}]	\N
e3dd19b6-9a1d-4fc6-a4b2-791da664f19d	2025-10-27 17:33:29.707076	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:29.705Z"}]	\N
6fb937b9-5b7f-4815-a60a-0d206b23d725	2025-10-27 17:33:30.682408	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:30.681Z"}]	\N
f3fc9b0e-8e11-4407-917b-0e1f38c0c046	2025-10-27 17:33:30.685779	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:30.684Z"}]	\N
088441c5-9e7a-4a13-8380-75659857148a	2025-10-27 17:33:31.68897	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:31.687Z"}]	\N
259266cb-6836-4a7c-8468-6657f474e9c9	2025-10-27 17:33:31.774024	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:31.772Z"}]	\N
cc9d71ee-ee6b-446c-87cc-5bd675ebb8d3	2025-10-27 17:33:32.694754	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:32.693Z"}]	\N
fad735c2-5654-4bb4-9689-e8560a68523a	2025-10-27 17:33:32.697196	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:32.695Z"}]	\N
40604a15-09ba-4a51-9441-ed0f9a88ceb8	2025-10-27 17:33:33.724664	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:33.723Z"}]	\N
2ce8d528-ed56-4b18-be62-8167974c8053	2025-10-27 17:33:33.727018	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:33.725Z"}]	\N
542b4a29-ee4b-4e26-98ff-52a4c653e379	2025-10-27 17:33:34.728995	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:34.727Z"}]	\N
13315e16-2ea2-4a80-a9ef-e29b9a274051	2025-10-27 17:33:34.736816	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:34.735Z"}]	\N
857d9b9b-73dc-42bf-8526-020927e782d2	2025-10-27 17:33:35.734278	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:35.732Z"}]	\N
fad8fe23-a107-48fd-97d5-e94f6dfec712	2025-10-27 17:33:35.731612	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:35.730Z"}]	\N
4c71575a-0abe-47bc-96a9-0f7141fe268d	2025-10-27 17:33:36.760052	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:36.758Z"}]	\N
90218ebc-d627-48b6-9b57-80f405ab7dc3	2025-10-27 17:33:36.774551	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:36.773Z"}]	\N
37b0ffd1-32cd-4e02-a2b9-6f6bf2a889ff	2025-10-27 17:33:37.780304	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:37.778Z"}]	\N
8ccfa584-9d19-455b-b11a-a5a8d40d8e86	2025-10-27 17:33:37.798117	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:37.793Z"}]	\N
6177c7d0-36ec-4235-bf1a-324f36701515	2025-10-27 17:33:38.782458	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:38.781Z"}]	\N
ae1a6078-5e13-4432-a7e0-a3bb2a7a2870	2025-10-27 17:33:38.788954	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:38.787Z"}]	\N
8034ff56-4685-46b8-aef3-be27d995ec78	2025-10-27 17:33:39.792969	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:39.791Z"}]	\N
e79fa23e-9444-4e79-ab9c-7926602c0b0f	2025-10-27 17:33:39.799012	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:39.797Z"}]	\N
f7641944-17c1-4990-bc16-3251f8ff66f2	2025-10-27 17:33:40.848669	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:40.847Z"}]	\N
1315abb5-2e2a-47f2-8a44-41d68d50ce43	2025-10-27 17:33:40.854646	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:40.849Z"}]	\N
a138fec0-8729-46e5-b839-95e52afba067	2025-10-27 17:33:41.786141	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:41.785Z"}]	\N
6351cc94-955e-4407-ac85-bbeeb87c577d	2025-10-27 17:33:41.789766	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:41.788Z"}]	\N
bcbc78e6-bf86-47da-9d17-62e85a27b01f	2025-10-27 17:33:42.79607	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:42.794Z"}]	\N
d3c0a803-3bd3-4d4f-af08-3acd4514cb2a	2025-10-27 17:33:42.796909	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:42.796Z"}]	\N
4b066422-0e63-4556-828a-56d0a779eb4e	2025-10-27 17:33:43.802642	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:43.801Z"}]	\N
cb3d0663-6341-474c-b225-67604b7d2237	2025-10-27 17:33:43.803484	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:33:43.802Z"}]	\N
36ec9f48-d7b0-4f6b-aebd-2f716c097968	2025-10-27 17:36:04.810965	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:04.805Z"}]	\N
4f1e3a61-ee35-48af-8523-2b042b94bcf1	2025-10-27 17:36:04.867476	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:04.866Z"}]	\N
9db57aa1-fdc7-4ad6-a150-d938d3b1b881	2025-10-27 17:36:04.924593	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:04.923Z"}]	\N
38a5358a-d738-4885-a11f-c28120d02c23	2025-10-27 17:36:04.926783	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:04.925Z"}]	\N
d376e66e-e44d-4423-af8e-e8a00732e26b	2025-10-27 17:36:04.960813	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:04.959Z"}]	\N
6d0df3d5-bfec-44ab-902c-054ae56013d4	2025-10-27 17:36:05.030026	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.029Z"}]	\N
4d0f0627-5b20-4e0f-bc3a-6f1e0be9828f	2025-10-27 17:36:05.05482	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.054Z"}]	\N
e5d41336-970c-43a4-86ff-fefa1cd79035	2025-10-27 17:36:05.173873	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.172Z"}]	\N
8b148035-0264-4d93-beed-864e3bc6b8cc	2025-10-27 17:36:05.221875	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.221Z"}]	\N
89933aca-e5fa-4fed-9a61-36e2909641a3	2025-10-27 17:36:05.238118	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.236Z"}]	\N
713d2700-5857-4bb4-89bc-7c29fc5e50de	2025-10-27 17:36:05.272302	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.271Z"}]	\N
6964104f-590a-4f60-a694-ba088555d87b	2025-10-27 17:36:06.980608	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:06.979Z"}]	\N
c5dabace-5671-4a43-abae-42e4ca5e7e30	2025-10-27 17:36:05.284459	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.283Z"}]	\N
f68bafca-980b-4d77-a9a0-556bb3d3d0ef	2025-10-27 17:36:05.307634	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.306Z"}]	\N
8dfa4456-13cb-479c-94be-dc6a68092643	2025-10-27 17:36:05.34092	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.340Z"}]	\N
3ef05007-a617-448d-a94a-df1a2dd3973b	2025-10-27 17:36:05.372701	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.371Z"}]	\N
973e8561-c5c9-49d8-867e-e37f70a34546	2025-10-27 17:36:05.406653	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.405Z"}]	\N
fbe68c17-2a31-41d5-a126-8756fabe5af7	2025-10-27 17:36:05.462111	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.461Z"}]	\N
b9a8cacf-fb64-4069-8f94-1f37c9f2404b	2025-10-27 17:36:05.50955	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.507Z"}]	\N
e70073c1-3738-495e-9cb2-11f6599803a8	2025-10-27 17:36:05.565508	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.564Z"}]	\N
03413c4e-f79e-4183-ba10-4ccc91b88546	2025-10-27 17:36:05.595546	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.595Z"}]	\N
8df4a825-c903-43d3-9789-77c7b657f68a	2025-10-27 17:36:05.607627	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.607Z"}]	\N
48d85ff8-e607-483c-a2cd-73d584eed388	2025-10-27 17:36:05.622598	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.622Z"}]	\N
4eef85b1-38b0-4043-b460-fcbdbee305db	2025-10-27 17:36:05.698054	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.697Z"}]	\N
0a4a55bb-c031-40ca-805a-2042cbc59e2e	2025-10-27 17:36:05.73445	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.733Z"}]	\N
bec5c6c5-b616-4245-9b11-daa98d476ba2	2025-10-27 17:36:05.873243	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.872Z"}]	\N
dca81cc3-8f1e-4330-ab3f-b3c327bd3e94	2025-10-27 17:36:05.998785	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:05.998Z"}]	\N
8ed69c09-1127-43f7-8587-b303ea7d3696	2025-10-27 17:36:06.038642	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:06.037Z"}]	\N
33fbb59c-2964-4292-9ee9-c6016526fcd7	2025-10-27 17:36:06.056792	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:06.056Z"}]	\N
ee21d7d2-b2bd-466a-bb9b-2862bf19d752	2025-10-27 17:36:06.954823	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:06.953Z"}]	\N
fb7e26f2-0f70-4640-bded-17ba920885b7	2025-10-27 17:36:07.296697	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:07.295Z"}]	\N
857b880a-e331-4139-ba7c-8b7dd0bde728	2025-10-27 17:36:07.305262	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:07.301Z"}]	\N
7ce3555c-701b-46a6-8a93-97b4c882fce3	2025-10-27 17:36:07.47404	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:07.468Z"}]	\N
e30677e7-6c2b-4b97-a615-2f73f63ad9d1	2025-10-27 17:36:07.572661	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:07.571Z"}]	\N
208c45bf-887e-4e79-8680-fccbc641bda8	2025-10-27 17:36:14.541259	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:36:14.540Z"}]	\N
5d8725b0-d99e-44af-a1ed-7954fdadc4a9	2025-10-27 17:45:02.790638	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:45:02.789Z"}]	\N
172db2e9-4acf-431b-a3c7-61aa93094743	2025-10-27 17:47:31.191865	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:47:31.190Z"}]	\N
c9f2f8b0-f639-44f3-8aff-ed9be73a6092	2025-10-27 18:02:43.784208	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:02:43.783Z"}]	\N
6c964805-d3f7-4f2f-835e-972da8cf7631	2025-10-27 18:08:07.506068	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:08:07.500Z"}]	\N
018afd1a-51fa-4f72-a6c4-c985012e2b72	2025-10-27 18:14:09.934853	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:14:09.933Z"}]	\N
fd856855-aeb8-4834-909f-0a9e3fe69818	2025-10-27 18:15:21.15784	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:15:21.154Z"}]	\N
3a40773d-2862-4eea-a92a-e2537109268c	2025-10-22 15:33:07.756228	[{"amount": 100000, "buyerId": "2e760685-ac21-4079-bd93-5b0ae13647e2", "actionTime": "2025-10-22T10:33:07.746Z"}, {"amount": 100000, "buyerId": "5faec7be-2e21-4696-b437-0a1ae98c4d93", "actionTime": "2025-10-22T10:42:55.741Z"}, {"amount": 100000, "buyerId": "5faec7be-2e21-4696-b437-0a1ae98c4d93", "actionTime": "2025-10-22T10:45:44.245Z"}, {"amount": 100000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-22T11:00:16.353Z"}, {"amount": "120001200", "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:13:31.800Z"}, {"amount": "12000120024000240", "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:13:37.427Z"}, {"amount": "120001200240002403600036007200072", "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:13:44.398Z"}, {"amount": "1200012002400024036000360072000721.200012002400024e+31", "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:13:52.357Z"}, {"amount": "120002400", "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:14:01.538Z"}, {"amount": "12000240012000240", "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:14:52.920Z"}, {"amount": "120001200", "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:15:50.569Z"}]	\N
bd5068c0-7aaa-46b8-835b-4ab28b6ed715	2025-10-27 18:17:24.997072	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:17:24.994Z"}]	\N
f55eb900-65c8-4ea6-90ce-bdde2d1e0612	2025-10-27 18:17:34.964243	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:17:34.962Z"}]	\N
1468dc1c-de85-42a0-8895-85ed31013898	2025-10-27 18:22:12.186236	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:22:12.185Z"}]	\N
32c34466-0dc5-4aa7-b70d-df74c2a3a43c	2025-10-27 18:24:58.016663	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:24:58.014Z"}]	\N
1fde7ad3-9f8f-4247-a129-7449aa38f75c	2025-10-22 15:33:15.490178	[{"amount": 100000, "buyerId": "2e760685-ac21-4079-bd93-5b0ae13647e2", "actionTime": "2025-10-22T10:33:15.488Z"}, {"amount": 100000, "buyerId": "5faec7be-2e21-4696-b437-0a1ae98c4d93", "actionTime": "2025-10-22T10:43:04.386Z"}, {"amount": 100000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-22T10:46:22.765Z"}, {"amount": 100000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-22T11:00:28.086Z"}, {"amount": "120001200", "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:16:43.205Z"}, {"amount": "120001200500", "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:16:58.215Z"}, {"amount": 120001200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:17:29.424Z"}, {"amount": 12000120024000240, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:17:38.671Z"}, {"amount": 120001200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:22:21.681Z"}, {"amount": 12000120024000240, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:22:29.289Z"}, {"amount": 120001200240002400000000000000000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:22:49.958Z"}, {"amount": 120001200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:25:02.132Z"}]	\N
2661dc6f-5857-40ef-a89e-7df1c8f7b1bf	2025-10-27 16:59:12.268022	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-27T11:59:12.263Z"}, {"amount": 120001200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:27:01.743Z"}]	\N
0b528643-5ae5-4eb5-983f-75a5b3b2f418	2025-10-27 17:00:22.964889	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-27T12:00:22.963Z"}, {"amount": 12000120024000240, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:27:07.832Z"}]	\N
eda13d0d-e681-45aa-944d-ab3cb8aecfe0	2025-10-27 17:31:39.552225	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:39.551Z"}, {"amount": 12000120024000240000000000000000000000000000000000000000000000000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:27:19.801Z"}]	\N
e0857bcb-8f68-4304-8b2c-7ca610dad0ca	2025-10-27 17:31:39.6455	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:39.644Z"}, {"amount": null, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:28:46.876Z"}]	\N
3ca7200f-b279-4456-a2b7-8fb0e1c5cb4a	2025-10-27 18:31:34.404936	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:31:34.403Z"}]	\N
8c7e630e-7093-4cf5-aa21-697b887ac64a	2025-10-27 17:31:41.414733	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:41.413Z"}, {"amount": 35840, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:31:55.926Z"}]	\N
b42ca563-1f62-4c50-ac77-1baaf93b49a1	2025-10-27 17:31:42.402868	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:42.401Z"}, {"amount": 56040, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:32:19.975Z"}]	\N
44eb4dda-fb7d-49f7-a727-14aeadc76c78	2025-10-27 18:36:11.130485	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:36:11.129Z"}]	\N
8e28c476-88ad-49a6-a9e6-3a7282128819	2025-10-27 18:36:39.016849	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:36:39.015Z"}]	\N
d3b8764d-6e33-46bb-9318-50f90718e2da	2025-10-27 18:44:03.972806	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:44:03.971Z"}]	\N
0b945af1-5f6c-4a21-89ce-ae61e8c5ed9a	2025-10-27 18:47:36.066932	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:47:36.065Z"}]	\N
fb5cb244-200a-4762-9772-4847f968bf11	2025-10-27 18:48:00.017911	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:48:00.016Z"}]	\N
025dc333-0b24-4523-97ba-1d77ea2e43f2	2025-10-27 18:51:07.190404	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:51:07.189Z"}]	\N
ce04d157-00ef-4715-895f-74867b0bf233	2025-10-27 18:52:44.889857	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:52:44.889Z"}]	\N
1ba6f1ec-b885-4aac-ad34-3ed7c4360549	2025-10-27 18:53:28.032641	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:53:28.032Z"}]	\N
68d82a53-e666-49ab-8dcc-1409fd5a6da0	2025-10-27 18:53:49.049465	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T13:53:49.048Z"}]	\N
3da0e031-58d2-49f2-9322-78e62184ee09	2025-10-27 17:31:43.429466	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:43.428Z"}, {"amount": 19008, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:53:54.132Z"}]	\N
0c9ecabf-e760-4d8e-b4db-3bb157f80531	2025-10-27 19:01:08.443712	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:01:08.441Z"}]	\N
87200e3d-e033-4f20-ba5a-796ebb15267f	2025-10-27 17:31:44.426986	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:44.426Z"}, {"amount": 25091, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:01:14.089Z"}]	\N
442d9d2c-1403-4cd1-b998-75cc025d7d49	2025-10-27 19:02:40.097816	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:02:40.097Z"}]	\N
e0e0f715-4c07-46b7-b7bc-12812c0dcacc	2025-10-27 17:31:46.448259	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:46.446Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:19:46.251Z"}]	\N
ddd5aee6-08af-414c-b731-33367447de11	2025-10-27 19:20:02.76545	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:20:02.764Z"}]	\N
b6121fb8-c6ef-4380-98de-9f9d0838403d	2025-10-27 17:31:47.45913	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:47.458Z"}, {"amount": 15972, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:20:05.593Z"}]	\N
4117095c-a9d4-4b0a-9905-c590efe0a429	2025-10-27 19:21:02.944778	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:21:02.940Z"}]	\N
befe476a-8ff2-4036-9846-a206003ac26d	2025-10-27 19:23:13.464704	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:23:13.461Z"}]	\N
7e4f170e-e0ad-4c5f-9a0b-f881244a8ba4	2025-10-27 17:31:48.454578	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:48.453Z"}, {"amount": 21259, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:23:49.422Z"}]	\N
65db3f5e-1d54-41e2-aa69-499e788576c7	2025-10-27 19:26:27.571002	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:26:27.568Z"}]	\N
a605a528-e99a-48bf-8681-ee1a55804761	2025-10-27 17:31:49.466955	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:49.466Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:26:44.420Z"}]	\N
e6e3a415-157e-4ff1-a38c-0fda20129b53	2025-10-27 19:42:49.944112	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-27T14:42:49.941Z"}]	\N
d7480552-f3b7-448e-bac1-d2f887a93b40	2025-10-27 19:42:49.970216	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:42:49.969Z"}]	\N
69e51420-3297-4e23-aad1-d018a13787e2	2025-10-27 19:44:59.029038	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:44:59.028Z"}]	\N
ebb0ea4d-f6cd-4eec-87f2-ecb5530ed7b7	2025-10-27 19:45:16.416626	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:45:16.415Z"}]	\N
be554b45-3b3a-432a-90bc-04da09f7cd69	2025-10-27 19:46:25.591111	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-27T14:46:25.590Z"}]	\N
a82ceb8f-2ef5-4635-aa0b-eda1ed169a18	2025-10-27 19:46:25.596691	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:46:25.596Z"}]	\N
ddca632f-f7a6-4338-8b0a-00209c8909d7	2025-10-27 19:46:25.668374	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:46:25.667Z"}]	\N
b9b1eb15-f9f4-4ab1-ba6d-bea0e9265eb6	2025-10-22 15:42:47.275248	[{"amount": 100000, "buyerId": "5faec7be-2e21-4696-b437-0a1ae98c4d93", "actionTime": "2025-10-22T10:42:47.269Z"}, {"amount": 100000, "buyerId": "5faec7be-2e21-4696-b437-0a1ae98c4d93", "actionTime": "2025-10-22T10:45:37.611Z"}, {"amount": 100000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-22T10:46:31.268Z"}, {"amount": 100000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-22T11:00:42.999Z"}, {"amount": 12000120012000120, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:25:23.118Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:43:11.432Z"}, {"amount": 15840, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:43:17.153Z"}, {"amount": 17424, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:43:25.022Z"}, {"amount": 19166, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:43:30.524Z"}, {"amount": 21083, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:45:22.322Z"}, {"amount": 23191, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T14:46:35.703Z"}]	\N
2c42b36f-94e7-4fa2-9d1c-b8362d3edb26	2025-10-27 19:55:05.842858	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-27T14:55:05.832Z"}]	\N
dfe16fed-7c17-4c43-b564-82c824bb4f75	2025-10-27 19:55:19.460654	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-27T14:55:19.459Z"}]	\N
ca0892a2-70d4-46c2-857a-58c32606a162	2025-10-27 19:55:19.496787	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T14:55:19.495Z"}]	\N
eeb43bfe-4621-4e1e-924a-c0b7dbf2d50c	2025-10-27 20:03:50.985719	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-27T15:03:50.984Z"}]	\N
c1020647-01b3-49c3-951a-0ad9737fc69a	2025-10-27 20:03:51.03095	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T15:03:51.030Z"}]	\N
29c93a7a-6fb0-4d67-baad-6a673587d307	2025-10-27 20:04:34.112031	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T15:04:34.111Z"}]	\N
f0f033ea-7d9e-457b-b143-5b43c5feed01	2025-10-27 20:05:17.097451	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T15:05:17.096Z"}]	\N
29bfd19b-d26c-41ca-8a60-fa0788436c26	2025-10-28 15:24:59.852574	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:24:59.852Z"}]	\N
0798acb8-bb5b-4a71-9257-5cabb49bf252	2025-10-28 15:24:59.874852	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:24:59.874Z"}]	\N
8fc2add3-3b12-49d2-9a25-baca01c8c828	2025-10-28 14:31:11.796649	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:31:11.796Z"}, {"amount": 3050520, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T11:02:45.057Z"}, {"amount": 3660624, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T11:25:15.327Z"}]	\N
eb57cc63-facc-436f-9789-eaeee4d075e0	2025-10-28 14:31:11.804956	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:31:11.804Z"}]	\N
9fc94f6f-7c61-4df8-813e-4a63dec6ad38	2025-10-28 14:31:11.871154	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:31:11.870Z"}]	\N
de767a00-7e51-4d2b-b855-413e60d3e3d4	2025-10-28 14:25:23.516047	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:25:23.515Z"}, {"amount": 2542100, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:25:36.035Z"}, {"amount": 3075941, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:31:15.218Z"}]	\N
ec764f0d-bf4d-4538-b643-6c444b18a85d	2025-10-28 14:29:26.297257	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:29:26.295Z"}, {"amount": 2542100, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:51:10.048Z"}, {"amount": 2796310, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:51:15.626Z"}]	\N
d0d714fe-714c-4e53-8335-5d81c243a234	2025-10-28 14:39:01.895058	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:39:01.893Z"}, {"amount": 14520, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:29:19.177Z"}, {"amount": 15972, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:29:20.536Z"}, {"amount": 17569, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:29:59.058Z"}, {"amount": 19326, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:30:02.086Z"}]	\N
d2eecb7c-bd4b-4263-a4bf-0b8dee51fbb2	2025-10-28 14:36:10.09473	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:36:10.094Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:36:20.008Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:39:11.680Z"}]	\N
7557a7af-5c18-4b64-82b6-63821abe67b8	2025-10-28 14:42:23.195043	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:42:23.194Z"}]	\N
74514607-7ba1-4490-b9f9-91a503a2fb86	2025-10-28 14:42:23.283683	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:42:23.282Z"}]	\N
37c5ad17-16f7-4f1a-8ff0-f47e479a6fe1	2025-10-28 14:36:10.106857	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:36:10.106Z"}, {"amount": 15840, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:36:26.697Z"}, {"amount": 14520, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:42:28.883Z"}]	\N
4d0b7cb1-d475-4e2c-8719-7f8772be85fe	2025-10-28 14:29:26.226306	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:29:26.224Z"}, {"amount": 2542100, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:42:36.715Z"}]	\N
30b206a2-cae9-4e2e-a7f1-f4b7f82b589b	2025-10-28 14:29:26.253258	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:29:26.251Z"}, {"amount": 3050520, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:42:42.094Z"}]	\N
a8283bfd-96ec-40f5-b78b-ed1c0694d797	2025-10-28 15:27:56.257362	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:27:56.256Z"}]	\N
95af3a10-2d72-456d-99ce-344fa0aa6820	2025-10-28 14:39:01.853331	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:39:01.852Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:02:49.682Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:28:52.153Z"}]	\N
b640104d-da2b-46a3-a106-44bc528dff14	2025-10-28 14:39:01.884909	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:39:01.883Z"}, {"amount": 15840, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:28:54.068Z"}, {"amount": 17424, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:28:56.274Z"}, {"amount": 13200, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:29:17.202Z"}]	\N
0a11b21f-4e42-4b15-b290-5503f9d8da0e	2025-10-28 14:25:23.540438	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:25:23.540Z"}, {"amount": 2796310, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:29:28.114Z"}, {"amount": 2542100, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T11:02:39.459Z"}]	\N
ec38db1a-84dc-463e-a915-fc974acab973	2025-10-28 16:05:54.005313	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:05:54.003Z"}]	\N
d6af6315-e87d-4cf4-bff8-bc7cdd5300f3	2025-10-28 14:51:01.646693	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:51:01.646Z"}]	\N
d93e8f6c-83ae-4fa7-891f-621605ea11eb	2025-10-28 14:51:01.664158	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:51:01.663Z"}]	\N
0876bf3b-2d14-43b9-8fea-6b06c7b9d06e	2025-10-28 14:51:01.679224	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:51:01.678Z"}]	\N
f8c853a3-0ea2-4712-af48-ddea3df056e4	2025-10-28 14:52:03.967879	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:52:03.966Z"}]	\N
48155581-49b8-4ccb-8812-086e04d928a4	2025-10-28 14:52:03.994872	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:52:03.993Z"}]	\N
8b1ccf1e-ec3d-4ca1-b09f-b74b52a8fd92	2025-10-28 14:56:41.633261	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:56:41.632Z"}]	\N
6e59a68c-cca4-47a5-9015-f1d1f9b6402e	2025-10-28 14:56:41.674993	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:56:41.674Z"}]	\N
989db682-e3ba-4721-9ae4-1cce2fc32e5c	2025-10-27 17:31:51.473872	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:51.473Z"}, {"amount": 14520, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:56:55.234Z"}]	\N
47fe7a3e-e3da-4935-b13a-64e985f16862	2025-10-28 14:58:56.135199	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:58:56.134Z"}]	\N
3783e498-4d54-4d4e-9265-689a7d25e94d	2025-10-28 14:58:56.178929	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:58:56.178Z"}]	\N
65ccc3d9-277e-42ce-8117-17775cd2a707	2025-10-28 14:59:55.79152	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:59:55.788Z"}]	\N
978efde1-5b8d-4557-9dde-34b47def1deb	2025-10-28 14:59:57.383355	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:59:57.381Z"}]	\N
cd974bde-e11c-4129-87e4-7acddc3846e5	2025-10-28 15:00:08.316595	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:00:08.315Z"}]	\N
c0269fc6-fe17-483d-9ecf-e94022aff463	2025-10-28 15:00:08.37263	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:00:08.367Z"}]	\N
be0d5776-7b5d-44ba-a2d1-c1772e828202	2025-10-27 17:31:39.530922	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:39.529Z"}, {"amount": 120001200240002400000000000000000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:27:13.915Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:00:14.412Z"}]	\N
88c6c5c1-edd9-4b9e-bb60-8b0c51361dab	2025-10-28 15:02:10.771139	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:02:10.769Z"}]	\N
d3de0ef1-d840-4955-83ca-cfe23bd7d0eb	2025-10-28 15:02:10.792258	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:02:10.790Z"}]	\N
813b9622-9187-4fb7-96da-6eb43bfce33c	2025-10-28 15:02:10.804063	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:02:10.802Z"}]	\N
fd5443fa-4d4b-4301-af94-e85c03a5189a	2025-10-28 15:20:17.07362	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:20:17.071Z"}]	\N
de5ca70e-2771-435e-b32d-f70cc2a0f990	2025-10-28 15:20:17.116265	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:20:17.115Z"}]	\N
3eba3fe8-e073-45b6-939c-651a6874020e	2025-10-27 17:31:39.554576	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:39.553Z"}, {"amount": null, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:27:37.891Z"}, {"amount": 13200, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:20:48.462Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:21:02.128Z"}, {"amount": 15840, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:21:07.553Z"}]	\N
f929816c-d082-48c9-ad66-d80001368672	2025-10-27 17:31:40.406137	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:40.404Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:31:37.009Z"}, {"amount": 20592, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:21:09.897Z"}, {"amount": 24710, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:21:11.645Z"}, {"amount": 29652, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:21:13.700Z"}, {"amount": 32617, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:21:17.640Z"}]	\N
b020b8c6-f164-4ea3-a64b-7af75de5a692	2025-10-27 17:31:40.416003	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:40.415Z"}, {"amount": 15840, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:31:42.670Z"}, {"amount": 35879, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:21:19.441Z"}, {"amount": 43055, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:21:21.101Z"}, {"amount": 51666, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:21:23.893Z"}, {"amount": 61999, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:21:30.035Z"}, {"amount": 74399, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:21:32.225Z"}]	\N
6bbc4605-9ba9-4cb2-933d-86db06f2a81b	2025-10-28 15:24:59.822291	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:24:59.821Z"}]	\N
7fcb3036-d2f8-4087-af19-af73dde0c6e2	2025-10-28 15:27:56.212417	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:27:56.211Z"}]	\N
ab38b555-3d5d-4c56-9b39-a8056aab7fe0	2025-10-27 17:31:41.418834	[{"amount": null, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-27T12:31:41.416Z"}, {"amount": 55840, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-27T13:32:10.354Z"}, {"amount": 81839, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:21:35.544Z"}, {"amount": 13200, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:25:14.159Z"}, {"amount": 15840, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:25:16.657Z"}, {"amount": 19008, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:25:19.183Z"}, {"amount": 20909, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:25:23.804Z"}, {"amount": 25091, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:25:26.792Z"}, {"amount": 13200, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:28:06.701Z"}]	\N
2121e3fe-e9e2-404a-bab8-07cf6db0579c	2025-10-28 15:28:20.264046	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:28:20.263Z"}]	\N
8bb81f82-0cc9-4a43-bcf4-a59b467edac1	2025-10-28 15:28:20.28265	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:28:20.282Z"}]	\N
ea3cc02f-6e88-4d41-985a-90f2cce5d874	2025-10-28 15:29:12.720972	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:29:12.719Z"}]	\N
beadb945-5179-41f3-9c7f-2a0796061ed9	2025-10-28 15:29:12.733262	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:29:12.732Z"}]	\N
d987a12c-70b2-4b87-83d1-287e30a2c4bc	2025-10-28 15:29:53.993398	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:29:53.992Z"}]	\N
b4da38a2-337f-4825-9632-9a94169d3ba4	2025-10-28 15:29:54.020222	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:29:54.019Z"}]	\N
0b8ced6e-611b-4c2e-803d-daeb48004773	2025-10-28 15:36:43.372309	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:36:43.371Z"}]	\N
3b03f736-027a-426a-b891-2a696bc1d9b4	2025-10-28 15:36:43.390086	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:36:43.389Z"}]	\N
72124ac6-ebad-44ff-b9b7-87462575982f	2025-10-28 15:36:43.402808	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:36:43.402Z"}]	\N
fb12c09b-1829-4736-9764-f1771bf74d80	2025-10-28 14:24:27.079911	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:24:27.078Z"}, {"amount": 145200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:33:01.496Z"}, {"amount": 159720, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:33:03.313Z"}, {"amount": 132000, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:37:05.608Z"}, {"amount": 145200, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:37:11.574Z"}]	\N
5e117a0b-453b-4090-a5bd-9c313f079072	2025-10-28 14:22:10.312666	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:22:10.310Z"}, {"amount": 145200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:22:44.659Z"}, {"amount": 175692, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:24:32.133Z"}, {"amount": 159720, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:37:23.084Z"}, {"amount": 175692, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:37:42.011Z"}]	\N
6fa82800-d0cf-4f15-9dab-615b5fbf5ee8	2025-10-28 15:38:22.41058	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:38:22.409Z"}]	\N
5fccad30-9517-4f2d-a801-0e02bcf77675	2025-10-28 15:38:22.420343	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:38:22.419Z"}]	\N
df3c1f9e-6178-4984-94fe-452134021d82	2025-10-28 15:38:22.428059	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:38:22.427Z"}]	\N
28dced1a-e810-40bc-ab36-cdd53847d6d8	2025-10-28 15:40:11.764697	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:40:11.764Z"}]	\N
8d80d2dc-b4f5-4278-aa9f-8d9578c50ab4	2025-10-28 15:40:11.973528	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:40:11.973Z"}]	\N
994d89d4-5660-44ac-b31a-78d359ad3051	2025-10-28 15:42:04.430832	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:42:04.429Z"}]	\N
e6ff79f2-dbff-4b69-9f55-bb7e4656d767	2025-10-28 15:42:04.701691	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:42:04.700Z"}]	\N
7ab4e2c5-0e10-4062-8e8c-f9187499a616	2025-10-28 14:49:13.853499	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:49:13.852Z"}, {"amount": 209088, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:40:53.153Z"}, {"amount": 229997, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:42:06.129Z"}]	\N
fb55d9e4-c6b3-43fa-9231-04cf4e89eddb	2025-10-28 16:02:19.93593	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:02:19.928Z"}]	\N
da92f968-f5e1-4091-8924-99040734dc77	2025-10-28 16:02:20.172032	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:02:20.170Z"}]	\N
72c9bdbf-8c2b-4e6b-abc9-34aeb17b8437	2025-10-28 16:05:54.189593	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:05:54.188Z"}]	\N
54dcd133-81df-42e3-84d2-96a0cba6cc80	2025-10-28 16:03:49.356135	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:03:49.355Z"}, {"amount": 2542100, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:06:05.276Z"}]	\N
dba6d707-816d-44cb-9d64-20c13356d9d8	2025-10-28 16:07:03.920744	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:07:03.919Z"}]	\N
ec978ba4-e145-4ca3-9b1d-758390c629ea	2025-10-28 16:07:03.926048	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:07:03.924Z"}]	\N
a9b9a02f-7e92-434d-bda7-1a5134bfa5fb	2025-10-28 16:07:03.999675	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:07:03.998Z"}]	\N
7b8a109a-c69b-4f77-97c2-0a2fc1809920	2025-10-28 16:07:04.416765	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:07:04.415Z"}]	\N
09e11b2b-2b94-4dc3-aadb-f7290dfe8bbb	2025-10-28 16:09:59.85436	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:09:59.848Z"}]	\N
d3b4d93f-c4f9-4c47-8a33-c1ff61a4c6ca	2025-10-28 16:09:59.889417	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:09:59.889Z"}]	\N
fccd612a-31cb-4021-aba8-86400bf2f4ad	2025-10-28 16:09:59.937487	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:09:59.937Z"}]	\N
6f9b347a-11a6-40cb-9d30-c19f9165c3c8	2025-10-28 16:10:00.298999	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:10:00.297Z"}]	\N
c18b45ce-f9c4-4829-a69f-554fbfd442e9	2025-10-28 16:10:37.068194	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:10:37.067Z"}]	\N
28936331-afd3-4d2f-9a44-4d569b36dd9a	2025-10-28 16:03:49.849498	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:03:49.848Z"}, {"amount": 2773200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:10:42.789Z"}]	\N
9fed9a4c-b3f4-47d4-b023-9629e5716f10	2025-10-28 16:16:39.569835	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:16:39.565Z"}]	\N
13eab49c-5131-47cd-a401-cdde4781de9c	2025-10-28 16:16:39.592971	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:16:39.592Z"}]	\N
52d2cb87-caad-477f-84e2-774d9dfe41e5	2025-10-28 16:16:40.170058	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:16:40.169Z"}]	\N
8df61849-28b1-4066-9407-4048e4803794	2025-10-28 16:17:20.764141	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:17:20.763Z"}]	\N
8bed0c61-ba2e-4c3b-b78f-827090dc3918	2025-10-28 16:17:20.964224	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:17:20.963Z"}]	\N
fb8dd5ff-7cd7-44a7-b5f7-ec6565360f8c	2025-10-28 16:03:49.401807	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:03:49.400Z"}, {"amount": 2796310, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:07:07.765Z"}, {"amount": 2542100, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:17:43.333Z"}]	\N
e1d6049e-1a34-4b39-95fa-f92894a23d9b	2025-10-28 16:19:50.738815	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:19:50.737Z"}]	\N
90b365cd-c4ff-4662-9d90-fead0649766f	2025-10-28 16:19:50.907831	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:19:50.905Z"}]	\N
fb70417e-4681-4008-9199-a3f0b7b5510d	2025-10-28 14:47:53.20994	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:47:53.208Z"}, {"amount": 132000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:38:37.696Z"}, {"amount": 145200, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:38:43.614Z"}, {"amount": 252997, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:42:08.426Z"}, {"amount": 132000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:20:08.130Z"}]	\N
4c5bcad5-2fd0-4429-baa1-b032a6a0ead6	2025-10-28 16:20:35.64455	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:20:35.643Z"}]	\N
672b5ebc-f745-439b-809a-09f113e1f12d	2025-10-28 14:47:53.26894	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:47:53.267Z"}, {"amount": 174240, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:38:50.706Z"}, {"amount": 132000, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:40:42.688Z"}, {"amount": 145200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:20:14.030Z"}, {"amount": 132000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:20:41.268Z"}]	\N
1e63fe58-31b2-40a0-90b4-1c4ea8de024c	2025-10-28 16:24:00.062462	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:24:00.061Z"}]	\N
f4cdb1ba-f92e-48fe-8e54-2d72e7109b6e	2025-10-28 16:24:00.247566	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:24:00.247Z"}]	\N
c03929c2-15c3-490a-ae4d-712688328e47	2025-10-28 14:49:13.837762	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:49:13.836Z"}, {"amount": 145200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T10:40:46.022Z"}, {"amount": 174240, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T10:40:49.000Z"}, {"amount": 158400, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:20:46.854Z"}, {"amount": 132000, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T11:24:08.216Z"}, {"amount": 158400, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:24:11.087Z"}, {"amount": 190080, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T11:24:14.215Z"}]	\N
63cb02aa-7f8b-4be2-aa2f-028de29ba254	2025-10-28 14:23:52.042965	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T09:23:52.042Z"}, {"amount": 132000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:47:59.829Z"}, {"amount": 145200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:48:05.407Z"}, {"amount": 132000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:49:21.427Z"}, {"amount": 209088, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:24:16.662Z"}]	\N
0e247fbb-998d-42ef-a7ac-874433492ddb	2025-10-28 15:32:36.945328	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T10:32:36.944Z"}, {"amount": 271814, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T11:24:19.605Z"}]	\N
a5f3f9fa-41d0-4c03-9b76-cbf571445ece	2025-10-28 15:32:36.975155	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T10:32:36.974Z"}, {"amount": 298995, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:24:22.128Z"}]	\N
57da8bc3-ea9e-4328-b3d5-99114061aca5	2025-10-28 16:24:39.918943	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:24:39.918Z"}]	\N
5b88cd84-d0a7-4ee9-b60f-61aeefd08b9e	2025-10-28 16:24:39.927349	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:24:39.926Z"}]	\N
c7bf52e2-da8b-4b67-8692-131f4a3d8fd6	2025-10-28 16:24:40.413471	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:24:40.412Z"}]	\N
9543f866-cccd-49f3-bb55-253b32b612d3	2025-10-28 14:22:10.262549	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T09:22:10.260Z"}, {"amount": 132000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:22:29.290Z"}, {"amount": 159720, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:24:09.132Z"}, {"amount": 145200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T09:49:26.906Z"}, {"amount": 132000, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T10:32:58.672Z"}, {"amount": 132000, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T11:24:46.071Z"}]	\N
84550a68-2c28-4ecb-aa4a-7f58d791a0b4	2025-10-28 16:24:58.562692	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:24:58.561Z"}]	\N
63405da0-07e2-4585-bb97-dd8ef0fe5653	2025-10-28 16:24:58.687588	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-28T11:24:58.687Z"}]	\N
5a509a59-7206-4320-9ba6-30cf48b71c2c	2025-10-28 16:03:49.322486	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-28T11:03:49.317Z"}, {"amount": 2542100, "buyerId": "cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9", "actionTime": "2025-10-28T11:04:08.875Z"}, {"amount": 2542100, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:16:46.592Z"}, {"amount": 2542100, "buyerId": "89a16887-cb47-4f01-8105-8b5a00f797a4", "actionTime": "2025-10-28T11:25:09.688Z"}, {"amount": 3050520, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-28T11:25:13.859Z"}]	\N
4dd60a74-6c4e-4108-8253-d84f2fdd0f91	2025-10-29 12:01:22.131608	[{"amount": 100000, "buyerId": "5faec7be-2e21-4696-b437-0a1ae98c4d93", "actionTime": "2025-10-29T07:01:22.125Z"}]	\N
d1c71272-7bb3-485e-8a3d-a7f707a10baf	2025-10-29 15:25:31.753446	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-29T10:25:31.752Z"}, {"amount": 132000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-29T17:48:36.124Z"}]	\N
b614d635-9dc5-4ac3-9e75-4d282150863a	2025-10-29 15:25:32.262824	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-29T10:25:32.261Z"}, {"amount": 158400, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-29T17:48:42.840Z"}]	\N
850893d5-ae0b-4f87-a6c9-572d59709ad2	2025-10-29 15:25:31.691349	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-29T10:25:31.689Z"}, {"amount": 132000, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-29T10:26:02.315Z"}, {"amount": 205920, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-29T17:48:49.820Z"}]	\N
a627c266-5ebe-4231-9972-81407d1c53fd	2025-10-29 22:46:34.26863	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-29T17:46:34.265Z"}, {"amount": 247104, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-29T17:48:56.542Z"}]	\N
0d953a85-d691-4cb0-a6b1-5b388dbefea8	2025-10-29 22:46:34.42838	[{"amount": 120000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-29T17:46:34.427Z"}, {"amount": 271814, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-29T17:49:03.025Z"}]	\N
a064a939-3439-46fc-962a-d315917078dd	2025-10-29 22:50:41.186202	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-29T17:50:41.185Z"}]	\N
0f9911b1-9b90-49db-83a1-f616f3b820a0	2025-10-29 22:50:41.213708	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-29T17:50:41.213Z"}]	\N
1d21609e-01c6-4fdd-8193-2a30747c1e7f	2025-10-29 22:50:41.643436	[{"amount": 2311000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-29T17:50:41.642Z"}, {"amount": 2773200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-29T17:51:14.391Z"}]	\N
4ff43451-9ee2-4883-9a9e-d4a0d5d88767	2025-10-29 22:51:33.281599	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-29T17:51:33.280Z"}]	\N
d40d8a44-4433-461c-97ca-b45c7d211830	2025-10-30 16:35:31.220728	[{"amount": 12000, "buyerId": "3b3432d1-8f75-4d3b-a9fa-322c479e6285", "actionTime": "2025-10-30T11:35:31.219Z"}]	\N
1f41de38-3d45-4a3f-a007-666aa8a0225e	2025-10-29 22:51:33.131217	[{"amount": null, "buyerId": "admin123", "actionTime": "2025-10-29T17:51:33.130Z"}, {"amount": 13200, "buyerId": "9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96", "actionTime": "2025-10-30T11:35:37.553Z"}]	\N
\.


--
-- Data for Name: buyers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buyers (id, full_name, password, hash, email, "buyerStatus", "createdAt", "updatedAt", interested) FROM stdin;
7129d408-2884-4563-bebf-e68310032d51	Abdulaziz	$2b$10$qx2DAMAT0z32DyYIQxsOr../WbYSBGeqjWiYPKOPPL8gfj0.Qa9C2	379909	abudev2@gmail.com	Pending	2025-10-20 16:55:17.564357+05	2025-10-20 16:55:17.564357+05	\N
beba5cb7-db45-4394-8c87-a62a218dc8db	Abdulaziz	$2b$10$D/sflPmikeP.NML6pXZWWOv2gPrkEAT/ozwACyWtuABbIYRqgP3nG	223344	abdulazizusmonov993@gmail.com	Pending	2025-10-20 17:03:15.270746+05	2025-10-20 17:03:15.270746+05	\N
f15c6e6c-800c-46d9-89dd-049089648487	Abdulaziz	$2b$10$vAOqAilvuBQpX8uOhdz9z.JiBgSVM9C.iCCshFlXBy5BNuR6850Iy	222211	abdulazizusmonov9933@gmail.com	Pending	2025-10-20 17:04:39.309393+05	2025-10-20 17:04:39.309393+05	\N
9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	Afruzbek	$2b$10$cSEhFFJBmAVnrJMf7m0I6.mthhOj.QhBtZFrzmS8jP3nJukbYWEvC	11223344	test4@gmail.com	Paid	2025-10-20 19:54:51.020277+05	2025-10-21 17:00:43.067292+05	COLLECTSIYA
5faec7be-2e21-4696-b437-0a1ae98c4d93	Abdilaziz	$2b$10$Va6y.NOb.Wc27uaDksDSBeOeQwC5BsmReCXkLxz2UGgO/FRbymxCm	112233	test5@gmail.com	Paid	2025-10-22 09:51:09.795203+05	2025-10-22 11:52:39.020067+05	LUXURY
89a16887-cb47-4f01-8105-8b5a00f797a4	Abdulaziz	$2b$10$EGvx/EzcVOd.b0kDjcX4eeti54LQl9xZ5lifrsXw59H3j7wDq.bw2	224455	abdulazizusmonov933@gmail.com	Paid	2025-10-20 17:14:03.834408+05	2025-10-28 15:18:15.894561+05	\N
cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	Abdulaziz	$2b$10$fRF1nhHrfrV./YGK8pnnNOvcPphqo.j4zapssq7tQ/NePBNBSkaIO	223311	abdilazizusmonov9953@gmail.com	Paid	2025-10-20 17:07:38.028516+05	2025-10-28 15:19:34.428837+05	\N
\.


--
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cards (id, card_number, date, cvc, buyer_id, created_at) FROM stdin;
437c1a69-ed8f-47f7-bd11-ef2bda7b6956	1122334455667788	2025-12-12	112	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	2025-10-20 21:38:33.78766
5da31e84-f75c-4a91-98fe-5475db9e00af	1122334455667788	2025-12-01	123	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2025-10-20 21:54:50.913124
5908d6c5-8b6f-4d7a-a618-885d1d749322	1122334455667788	2026-12-01	331	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2025-10-21 15:53:45.570899
fb240e6e-8e42-432f-9951-8f3d6f0e6ba8	1122334455667788	2032-12-01	121	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	2025-10-21 16:04:40.297449
feafdd5f-0941-4860-9d3a-7ac77e422730	1122334455667788	2032-12-01	213	5faec7be-2e21-4696-b437-0a1ae98c4d93	2025-10-22 10:47:19.344402
05673bf0-b60a-43aa-b6a7-5fec04d87308	1122334444556677	2043-12-01	323	89a16887-cb47-4f01-8105-8b5a00f797a4	2025-10-28 15:16:40.771015
\.


--
-- Data for Name: lot_buyers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lot_buyers (lot_id, buyer_id) FROM stdin;
2dbcaeef-052f-4ab0-9c71-b8636f47d79f	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96
6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	5faec7be-2e21-4696-b437-0a1ae98c4d93
e7525e5a-02e7-4a0c-8879-5af8daee5ca9	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96
6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96
2dbcaeef-052f-4ab0-9c71-b8636f47d79f	5faec7be-2e21-4696-b437-0a1ae98c4d93
e7525e5a-02e7-4a0c-8879-5af8daee5ca9	5faec7be-2e21-4696-b437-0a1ae98c4d93
820afabe-94b2-4dbb-be70-095010428b1d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96
2dbcaeef-052f-4ab0-9c71-b8636f47d79f	89a16887-cb47-4f01-8105-8b5a00f797a4
e7525e5a-02e7-4a0c-8879-5af8daee5ca9	89a16887-cb47-4f01-8105-8b5a00f797a4
6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	89a16887-cb47-4f01-8105-8b5a00f797a4
820afabe-94b2-4dbb-be70-095010428b1d	89a16887-cb47-4f01-8105-8b5a00f797a4
739452b7-32a2-4b6b-b528-100fdd965fcf	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96
\.


--
-- Data for Name: lots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lots (id, starting_bit, description, tool_name, tool_type, address, status, "isActive", "likesCount", start_time, admin_id, buyer_id, image_url, "lotFile", created_at, updated_at, info) FROM stdin;
6c782519-2ef9-4cd2-a8a4-0fdb29b4210e	12000	"{\\"key\\":\\"salom\\",\\"val\\":\\"alik\\"}"	Samaliyot	ART	Novza metro dodo pizza	played	f	1	2025-12-23	3b3432d1-8f75-4d3b-a9fa-322c479e6285	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	["d54db18d-25ae-456c-9ee5-1cafe56c5d42_horse.1left.jpg","156b840f-1653-423a-bee0-5f8653d9ab04_horse.2right.jpg","85b284e8-f0e0-4a54-a765-74b3ded0dfc8_horse.6back.jpg","6f2ddf29-a73e-4fe7-ad60-37f345bf65c7_horse.7front.jpg"]	"1d04a894-390f-43f8-94c9-62ee6e00d6b2_Europass.pdf"	2025-10-20 15:15:40.93775	2025-10-30 16:35:47.383322	\N
739452b7-32a2-4b6b-b528-100fdd965fcf	2311000	"[{\\"key\\":\\"ssd\\",\\"val\\":\\"1tr\\"}]"	Kompyuter	LUXURY	toshkent novza metro	played	f	5	2025-11-09	3b3432d1-8f75-4d3b-a9fa-322c479e6285	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	["3cf2bf7d-36ea-48ee-a2d4-1cc7bc568603_Skrinshot 2025-10-28 112815.png","3c20061d-3113-41e1-a377-e1a4e629dfb5_Skrinshot 2025-10-24 132136.png","6e51ce06-19a4-4a00-a124-c4bb019c1684_Skrinshot 2025-10-24 131845.png"]	"33240168-52f6-4758-8c09-9a62db428b03_bachelor-allows (1).pdf"	2025-10-28 11:39:51.339532	2025-10-30 16:33:21.91999	\N
820afabe-94b2-4dbb-be70-095010428b1d	120000	"[{\\"key\\":\\"graphcs\\",\\"val\\":\\"core i5 rtx\\"},{\\"key\\":\\"ssd \\",\\"val\\":\\"1tr\\"},{\\"key\\":\\"windows\\",\\"val\\":\\"11\\"}]"	Nooutbook	LUXURY	toshkent novza metro	played	f	8	2025-11-09	3b3432d1-8f75-4d3b-a9fa-322c479e6285	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	["68fafcb2-9010-4c03-af3a-f13cb6f4935c_Skrinshot 2025-09-22 115246.png","4a2e1c4f-a8c1-49a6-ad79-62d98edb3e6f_Skrinshot 2025-09-21 224536.png","0ef95640-a085-48fa-a453-b17553557ede_Skrinshot 2025-09-21 224238.png","eb05c00d-efc6-4b6d-a83e-ab91b2592fc3_Skrinshot 2025-09-21 221156.png"]	"1b3c65df-0597-48bc-a11c-0d0894f003de_bachelor-answers-mandat (1).pdf"	2025-10-28 12:27:40.483978	2025-10-30 16:34:50.653059	ajoyib noutbook bu aserlarning eng sungi avlodi
e7525e5a-02e7-4a0c-8879-5af8daee5ca9	12000	"{\\"key\\":\\"salom\\",\\"val\\":\\"alik\\"}"	Velosiped	ART	Novza metro dodo pizza	pending	f	4	2025-12-22	3b3432d1-8f75-4d3b-a9fa-322c479e6285	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	["bbf664e4-9f03-4d88-b34b-d302c86c201f_horse.1left.jpg","b496d378-d86a-42a3-90e3-e4c60e576f6b_horse.2right.jpg","8c9e4ac0-a8ab-40c5-9910-89441b220e63_horse.6back.jpg","c7b39c94-f6b0-4ca2-8a14-6daf3adc0714_horse.7front.jpg"]	"6cf7c6f1-be58-4f58-876c-db3d6807ce8f_Europass.pdf"	2025-10-20 15:43:37.352635	2025-10-30 16:33:19.106782	\N
2dbcaeef-052f-4ab0-9c71-b8636f47d79f	12000	"{\\"key\\":\\"salom\\",\\"val\\":\\"alik\\"}"	Horse 	ART	Novza metro dodo pizza	pending	f	4	2025-12-24	3b3432d1-8f75-4d3b-a9fa-322c479e6285	\N	["220857a2-b0a0-433a-bdf5-874728e34952_horse.1left.jpg","84d253f3-6bc3-4a79-8c5f-2bcccd5fb81b_horse.2right.jpg","3ee8f78e-6623-416a-b998-34e56166501b_horse.6back.jpg","836b888b-ffa6-4355-81da-157c29682b05_horse.7front.jpg"]	"39d1fa44-adce-4f87-a70e-2e1648f8144a_Europass.pdf"	2025-10-20 15:44:39.886146	2025-10-30 16:33:20.324098	\N
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, buyer_id, provider, amount, "providerTransactionId", currency, "buyerStatus", metadata, created_at, card_id) FROM stdin;
27a8122d-12b4-4a2d-8713-846036957f1d	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	stripe	18000	pi_3SKLh3L616f0TvDE1DyH0V8V	USD	Pending	{"desktop":"victus","os":"windows 11 pro"}	2025-10-22 09:20:47.575529	\N
8811cb3f-805a-4994-bbb2-5c9847c1b29d	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	stripe	18000	pi_3SKdkuL616f0TvDE0Ghzh0zk	USD	Pending	{"desktop":"Win32","os":"Windows"}	2025-10-22 09:20:47.575529	\N
cc65a433-e494-42bc-b66c-fe16491d75a7	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	stripe	18000	pi_3SKdmDL616f0TvDE02tTybIX	USD	Pending	{"desktop":"Win32","os":"Windows"}	2025-10-22 09:20:47.575529	\N
93598457-8584-4369-a2a0-1b53bea37288	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	stripe	18000	pi_3SKdpwL616f0TvDE0eT71nZp	USD	Pending	{"desktop":"Win32","os":"Windows"}	2025-10-22 09:20:47.575529	\N
4accd252-a802-4efb-8e47-e42ce6f93352	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	stripe	18000	pi_3SKdseL616f0TvDE1LLCj3Hr	USD	Pending	{"desktop":"Win32","os":"Windows"}	2025-10-22 09:20:47.575529	\N
a36d8d60-a4e6-4e95-acf9-461f67f4fe74	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	stripe	18000	pi_3SKdspL616f0TvDE1RegdZM7	USD	Pending	{"desktop":"Win32","os":"Windows"}	2025-10-22 09:20:47.575529	\N
d349d292-244a-4604-81a6-9ae082b819f8	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	stripe	18000	pi_3SKeAGL616f0TvDE0SnfeEQg	USD	Pending	{"desktop":"Win32","os":"Windows"}	2025-10-22 09:20:47.575529	\N
e0f4e48f-764f-4993-87f3-d6c2fae5b278	9aea7e0e-c56f-4ebd-8a0a-90ae092e3f96	stripe	18000	pi_3SKeF3L616f0TvDE1wqEC9R9	USD	Paid	{"desktop":"Win32","os":"Windows"}	2025-10-22 09:20:47.575529	\N
dd39550f-e4fb-4878-9759-444740fda12f	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	stripe	100000	pi_3SKv7EL616f0TvDE1LLzoLTf	USD	Pending	{"desktop":"victus","os":"windows 11 pro"}	2025-10-22 11:01:45.873779	\N
3abe0f0b-b1cd-441e-a66f-e910680ab25e	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	stripe	100000	pi_3SKvB9L616f0TvDE1AFVCb90	USD	Pending	{"desktop":"victus","os":"windows 11 pro"}	2025-10-22 11:05:49.549569	\N
8bee725d-bbdc-495f-b0ed-205f6e4e0314	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	stripe	100000	pi_3SKvBLL616f0TvDE1gEWjodc	USD	Pending	{"desktop":"victus","os":"windows 11 pro"}	2025-10-22 11:06:00.812346	\N
035a625b-0ef1-408b-a6a2-c15123e7103c	5faec7be-2e21-4696-b437-0a1ae98c4d93	stripe	200000	pi_3SKvTNL616f0TvDE0omSlGli	USD	Pending	{"desktop":"Win32","os":"Windows"}	2025-10-22 11:24:39.451248	\N
b6a35072-ee2e-47d5-8b4a-609490d8978b	5faec7be-2e21-4696-b437-0a1ae98c4d93	stripe	100000	pi_3SKvVZL616f0TvDE1ZenWYtC	USD	Pending	{"desktop":"Win32","os":"Windows"}	2025-10-22 11:26:54.851838	\N
2c64d9ed-0d2a-4e97-9eb3-637129e6f407	5faec7be-2e21-4696-b437-0a1ae98c4d93	stripe	100	pi_3SKvuSL616f0TvDE0gMaIiUr	USD	Paid	{"desktop":"Win32","os":"Windows"}	2025-10-22 11:52:38.631562	\N
eb6c435d-ce71-4b59-bb5c-5de8a783a40a	89a16887-cb47-4f01-8105-8b5a00f797a4	stripe	100	pi_3SN9yiL616f0TvDE0XGvcl0X	USD	Paid	{"desktop":"Win32","os":"Windows"}	2025-10-28 15:18:15.282807	\N
ffcb344a-e6a7-4d7d-a119-c3cf6afc369a	cf76c5db-9c92-4f5e-80e9-0a4bfe2eb9b9	stripe	100	pi_3SN9zzL616f0TvDE0VPwlvIl	USD	Paid	{"desktop":"Win32","os":"Windows"}	2025-10-28 15:19:33.50344	\N
\.


--
-- Name: lot_buyers PK_0cdf1fdb2b2a1587eb077766cdb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lot_buyers
    ADD CONSTRAINT "PK_0cdf1fdb2b2a1587eb077766cdb" PRIMARY KEY (lot_id, buyer_id);


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: lots PK_2bb990a4015865cb1daa1d22fd9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lots
    ADD CONSTRAINT "PK_2bb990a4015865cb1daa1d22fd9" PRIMARY KEY (id);


--
-- Name: cards PK_5f3269634705fdff4a9935860fc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY (id);


--
-- Name: buyers PK_aff372821d05bac04a18ff8eb87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyers
    ADD CONSTRAINT "PK_aff372821d05bac04a18ff8eb87" PRIMARY KEY (id);


--
-- Name: aucsion-resaults PK_b6e489f512b14b95f7982addd63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."aucsion-resaults"
    ADD CONSTRAINT "PK_b6e489f512b14b95f7982addd63" PRIMARY KEY (id);


--
-- Name: bit-history PK_dcf33e95c127b1b20889599cbe7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."bit-history"
    ADD CONSTRAINT "PK_dcf33e95c127b1b20889599cbe7" PRIMARY KEY (id);


--
-- Name: admins PK_e3b38270c97a854c48d2e80874e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY (id);


--
-- Name: buyers UQ_c63a289e65c35c1971da0c2f7bd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyers
    ADD CONSTRAINT "UQ_c63a289e65c35c1971da0c2f7bd" UNIQUE (email);


--
-- Name: IDX_5043b3df5ac8999b5b4109e431; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_5043b3df5ac8999b5b4109e431" ON public.lot_buyers USING btree (lot_id);


--
-- Name: IDX_80544b952260de792566dec1a4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_80544b952260de792566dec1a4" ON public.lot_buyers USING btree (buyer_id);


--
-- Name: lots FK_4f8073cd3b7ffadf594ab69e622; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lots
    ADD CONSTRAINT "FK_4f8073cd3b7ffadf594ab69e622" FOREIGN KEY (admin_id) REFERENCES public.admins(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lot_buyers FK_5043b3df5ac8999b5b4109e431c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lot_buyers
    ADD CONSTRAINT "FK_5043b3df5ac8999b5b4109e431c" FOREIGN KEY (lot_id) REFERENCES public.lots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: aucsion-resaults FK_56efbf86f0f40046726ea2cdeef; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."aucsion-resaults"
    ADD CONSTRAINT "FK_56efbf86f0f40046726ea2cdeef" FOREIGN KEY (buyer_id) REFERENCES public.buyers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lot_buyers FK_80544b952260de792566dec1a44; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lot_buyers
    ADD CONSTRAINT "FK_80544b952260de792566dec1a44" FOREIGN KEY (buyer_id) REFERENCES public.buyers(id);


--
-- Name: cards FK_8ebcc9c6c82261b78abd59872b3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT "FK_8ebcc9c6c82261b78abd59872b3" FOREIGN KEY (buyer_id) REFERENCES public.buyers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: aucsion-resaults FK_97b2fab8ecac24950d9bad73eb3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."aucsion-resaults"
    ADD CONSTRAINT "FK_97b2fab8ecac24950d9bad73eb3" FOREIGN KEY (lot_id) REFERENCES public.lots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments FK_9938ec0b00c17ad9a437d206afb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_9938ec0b00c17ad9a437d206afb" FOREIGN KEY (buyer_id) REFERENCES public.buyers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

