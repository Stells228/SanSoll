--
-- PostgreSQL database dump
--

\restrict ksf4pP242Y47R0YrUa34wX6eQfdq1cnAa7Pn153F26roxs7fXvxFDsocykoSHMQ

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

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
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    id bigint NOT NULL,
    image_url character varying(500) NOT NULL,
    "position" integer NOT NULL,
    title character varying(255),
    uploaded_at timestamp(6) without time zone
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificates_id_seq OWNER TO postgres;

--
-- Name: certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;


--
-- Name: login_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_logs (
    id bigint NOT NULL,
    login_at timestamp(6) without time zone NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.login_logs OWNER TO postgres;

--
-- Name: login_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_logs_id_seq OWNER TO postgres;

--
-- Name: login_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_logs_id_seq OWNED BY public.login_logs.id;


--
-- Name: medicine_schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicine_schedules (
    id bigint NOT NULL,
    date date NOT NULL,
    dose double precision NOT NULL,
    taken boolean NOT NULL,
    "time" character varying(5),
    zone character varying(20) NOT NULL,
    user_id bigint NOT NULL,
    user_medicine_id bigint NOT NULL
);


ALTER TABLE public.medicine_schedules OWNER TO postgres;

--
-- Name: medicine_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medicine_schedules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medicine_schedules_id_seq OWNER TO postgres;

--
-- Name: medicine_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medicine_schedules_id_seq OWNED BY public.medicine_schedules.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    price_at_purchase numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    is_replenished boolean NOT NULL,
    shipping_address text NOT NULL,
    status character varying(20) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    track_number character varying(50),
    user_id bigint,
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'ASSEMBLING'::character varying, 'SHIPPED'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partners (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    specialty character varying(255)
);


ALTER TABLE public.partners OWNER TO postgres;

--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partners_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partners_id_seq OWNER TO postgres;

--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id bigint NOT NULL,
    image_url character varying(500) NOT NULL,
    "position" integer,
    product_id bigint NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    certificate character varying(255),
    composition text,
    contraindications text,
    created_at timestamp(6) without time zone,
    default_dosage character varying(100),
    description text,
    discount numeric(10,2),
    dosage text,
    dosage_form character varying(50),
    features jsonb,
    indications text,
    is_active boolean NOT NULL,
    is_bad boolean,
    manufacturer character varying(255),
    pack_size integer,
    price numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    title character varying(255) NOT NULL,
    unit character varying(20),
    category_id bigint,
    partner_id bigint
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    is_approved boolean NOT NULL,
    rating integer NOT NULL,
    text text NOT NULL,
    product_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: user_medicines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_medicines (
    id bigint NOT NULL,
    added_at timestamp(6) without time zone,
    custom_title character varying(255),
    custom_unit character varying(20),
    is_custom boolean NOT NULL,
    taken_units double precision NOT NULL,
    total_units double precision NOT NULL,
    product_id bigint,
    user_id bigint NOT NULL
);


ALTER TABLE public.user_medicines OWNER TO postgres;

--
-- Name: user_medicines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_medicines_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_medicines_id_seq OWNER TO postgres;

--
-- Name: user_medicines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_medicines_id_seq OWNED BY public.user_medicines.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    avatar_url character varying(500),
    created_at timestamp(6) without time zone,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(20),
    role character varying(20) NOT NULL,
    token_version integer NOT NULL,
    username character varying(50) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['USER'::character varying, 'ADMIN'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: certificates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);


--
-- Name: login_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs ALTER COLUMN id SET DEFAULT nextval('public.login_logs_id_seq'::regclass);


--
-- Name: medicine_schedules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine_schedules ALTER COLUMN id SET DEFAULT nextval('public.medicine_schedules_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: user_medicines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_medicines ALTER COLUMN id SET DEFAULT nextval('public.user_medicines_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug) FROM stdin;
1	Иммунитет и защита	immunity
2	Сердце и сосуды	cardio
3	Красота и фигура	beauty
4	Пищеварение и очищение	detox
\.


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (id, image_url, "position", title, uploaded_at) FROM stdin;
1	/certificates/1.webp	1	Сертификат 1	2026-09-29 23:40:48.333133
2	/certificates/2.webp	2	Сертификат 2	2026-09-29 23:40:48.350406
3	/certificates/3.webp	3	Сертификат 3	2026-09-29 23:40:48.350406
4	/certificates/4.webp	4	Сертификат 4	2026-09-29 23:40:48.350406
5	/certificates/5.webp	5	Сертификат 5	2026-09-29 23:40:48.350406
6	/certificates/6.webp	6	Сертификат 6	2026-09-29 23:40:48.350406
7	/certificates/7.webp	7	Сертификат 7	2026-09-29 23:40:48.364572
8	/certificates/8.webp	8	Сертификат 8	2026-09-29 23:40:48.369162
9	/certificates/9.webp	9	Сертификат 9	2026-09-29 23:40:48.371177
10	/certificates/10.webp	10	Сертификат 10	2026-09-29 23:40:48.371177
11	/certificates/11.webp	11	Сертификат 11	2026-09-29 23:40:48.371177
12	/certificates/12.webp	12	Сертификат 12	2026-09-29 23:40:48.371177
13	/certificates/13.webp	13	Сертификат 13	2026-09-29 23:40:48.383799
14	/certificates/14.webp	14	Сертификат 14	2026-09-29 23:40:48.385477
15	/certificates/15.webp	15	Сертификат 15	2026-09-29 23:40:48.385477
16	/certificates/16.webp	16	Сертификат 16	2026-09-29 23:40:48.385477
17	/certificates/17.webp	17	Сертификат 17	2026-09-29 23:40:48.395388
18	/certificates/18.webp	18	Сертификат 18	2026-09-29 23:40:48.397932
19	/certificates/19.webp	19	Сертификат 19	2026-09-29 23:40:48.400327
20	/certificates/20.webp	20	Сертификат 20	2026-09-29 23:40:48.400327
21	/certificates/21.webp	21	Сертификат 21	2026-09-29 23:40:48.400327
22	/certificates/22.webp	22	Сертификат 22	2026-09-29 23:40:48.400327
23	/certificates/23.webp	23	Сертификат 23	2026-09-29 23:40:48.400327
24	/certificates/24.webp	24	Сертификат 24	2026-09-29 23:40:48.415668
25	/certificates/25.webp	25	Сертификат 25	2026-09-29 23:40:48.417336
26	/certificates/26.webp	26	Сертификат 26	2026-09-29 23:40:48.417336
27	/certificates/27.webp	27	Сертификат 27	2026-09-29 23:40:48.417336
28	/certificates/28.webp	28	Сертификат 28	2026-09-29 23:40:48.417336
29	/certificates/29.webp	29	Сертификат 29	2026-09-29 23:40:48.417336
30	/certificates/30.webp	30	Сертификат 30	2026-09-29 23:40:48.417336
\.


--
-- Data for Name: login_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_logs (id, login_at, user_id) FROM stdin;
\.


--
-- Data for Name: medicine_schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicine_schedules (id, date, dose, taken, "time", zone, user_id, user_medicine_id) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, price_at_purchase, quantity, order_id, product_id) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, created_at, is_replenished, shipping_address, status, total_amount, track_number, user_id) FROM stdin;
\.


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partners (id, name, specialty) FROM stdin;
1	ФитоЛайн	Противовирусные комплексы
2	Апифарм	Сердечно-сосудистая система
3	AD Medicine	Коллоидные технологии
4	НПФ Новь	Энтеросорбенты
5	Биолит	Натуральные экстракты
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, image_url, "position", product_id) FROM stdin;
1	/products/4.webp	0	1
2	/products/5.webp	0	1
3	/products/6.webp	0	1
4	/products/7.webp	0	1
5	/products/8.webp	0	1
6	/products/9.webp	0	2
7	/products/10.webp	0	2
8	/products/11.webp	0	2
9	/products/12.webp	0	2
10	/products/13.webp	0	2
11	/products/14.webp	0	2
12	/products/38.webp	0	3
13	/products/39.webp	0	3
14	/products/40.webp	0	3
15	/products/41.webp	0	3
16	/products/1.webp	0	4
17	/products/2.webp	0	4
18	/products/3.webp	0	4
19	/products/58.webp	0	5
20	/products/59.webp	0	5
21	/products/60.webp	0	5
22	/products/49.webp	0	6
23	/products/50.webp	0	6
24	/products/51.webp	0	6
25	/products/55.webp	0	7
26	/products/56.webp	0	7
27	/products/57.webp	0	7
28	/products/64.webp	0	8
29	/products/65.webp	0	8
30	/products/66.webp	0	8
31	/products/15.webp	0	9
32	/products/16.webp	0	9
33	/products/17.webp	0	9
34	/products/61.webp	0	10
35	/products/62.webp	0	10
36	/products/63.webp	0	10
37	/products/18.webp	0	11
38	/products/19.webp	0	11
39	/products/20.webp	0	11
40	/products/72.webp	0	12
41	/products/73.webp	0	12
42	/products/74.webp	0	12
43	/products/21.webp	0	13
44	/products/22.webp	0	13
45	/products/23.webp	0	13
46	/products/24.webp	0	13
47	/products/34.webp	0	14
48	/products/35.webp	0	14
49	/products/36.webp	0	14
50	/products/37.webp	0	14
51	/products/25.webp	0	15
52	/products/26.webp	0	15
53	/products/27.webp	0	15
54	/products/28.webp	0	15
55	/products/29.webp	0	16
56	/products/30.webp	0	16
57	/products/31.webp	0	16
58	/products/32.webp	0	16
59	/products/33.webp	0	16
60	/products/67.webp	0	17
61	/products/68.webp	0	17
62	/products/69.webp	0	17
63	/products/70.webp	0	17
64	/products/71.webp	0	17
65	/products/42.webp	0	18
66	/products/43.webp	0	18
67	/products/44.webp	0	18
68	/products/52.webp	0	19
69	/products/53.webp	0	19
70	/products/54.webp	0	19
71	/products/45.webp	0	20
72	/products/46.webp	0	20
73	/products/47.webp	0	20
74	/products/48.webp	0	20
75	/products/75.webp	0	21
76	/products/76.webp	0	21
77	/products/77.webp	0	21
78	/products/78.webp	0	21
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, certificate, composition, contraindications, created_at, default_dosage, description, discount, dosage, dosage_form, features, indications, is_active, is_bad, manufacturer, pack_size, price, stock, title, unit, category_id, partner_id) FROM stdin;
1	RU.77.99.88.003.Е.005657.04.15	Хвойная хлорофилло-каротиновая паста, МКЦ (загуститель), лактоза, поливинилпирролидон (загуститель), крахмал картофельный, стеарат кальция (антислеживатель).	Индивидуальная непереносимость компонентов.	2026-09-29 23:40:48.081256	1 таблетка	Повышает иммунитет, усиливает кроветворение, нормализует жировой обмен.	0.00	Взрослым по 1–3 таблетки 2–3 раза в день во время приема пищи. Продолжительность приема – 1–3 месяца.	Таблетки	["19 аминокислот", "Витамины группы B, A, E", "Противовирусный эффект", "Нормализует липидный обмен"]	Для повышения иммунитета, предупреждения гриппа и других ОРВИ, снижения риска развития атеросклероза, нормализации кроветворения.	t	f	ООО «Фитолайн», г. Москва	80	1854.00	100	Лесмин	таб	1	1
2	RU.77.99.88.003.Е.002894.07.16	Лактоза, подсластитель сорбит; экстракты прополиса, овса посевного, плодов шиповника, травы зверобоя, плодов аронии, цветков ноготков.	Индивидуальная непереносимость, беременность, кормление грудью.	2026-09-29 23:40:48.1457	1 таблетка	Способствует нормализации артериального давления.	0.00	Взрослым — по 2 таблетки 3–4 раза в день во время еды.	Таблетки	["Улучшает кровообращение мозга", "Повышает память", "Нормализует давление", "Укрепляет сосуды"]	Нейроциркуляторная дистония, остеохондроз шейного отдела, атеросклероз сосудов головного мозга.	t	f	ООО «Апифарм», г. Бердск	50	1144.00	100	Вазолептин	таб	2	2
3	RU.77.99.88.003.E.002893.07.16	Лактоза, сорбит, экстракты плодов шиповника, прополиса, боярышника, мяты перечной, календулы.	Индивидуальная непереносимость компонентов.	2026-09-29 23:40:48.149055	1 таблетка	БАД для поддержки работы сердечно-сосудистой системы.	0.00	Взрослым — по 2 таблетки 3–4 раза в день во время еды.	Таблетки	["Поддержка кровообращения", "Снижает холестерин", "Укрепляет стенки сосудов", "Антиоксидантный эффект"]	Гипертоническая болезнь, атеросклероз, ишемическая болезнь сердца.	t	f	ООО «Апифарм», г. Бердск	50	1144.00	100	Кардиолептин	таб	2	2
4	ЕАЭС N RU Д-RU.РА04.В.69383/24	Сорбит, сухие экстракты худии, ягод годжи, зеленого кофе, гуараны, померанца.	Индивидуальная непереносимость компонентов.	2026-09-29 23:40:48.170834	1 таблетка	Активный жиросжигатель для снижения массы тела	0.00	По 2–3 таблетки 3 раза в день во время приема пищи или независимо от еды.	Таблетки	["Подавляет аппетит", "Сжигает жир", "Ускоряет метаболизм", "100% натуральный состав"]	Для снижения массы тела.	t	f	ООО «Апифарм», г. Бердск	100	1547.00	100	Худия Годжи	таб	3	2
5	RU.77.99.11.003.R.001045.04.23	Вода очищенная, глюкозамин, метилсульфонилметан, L-аскорбиновая кислота, хондроитинсульфат, гиалуронат натрия.	Индивидуальная непереносимость; беременность и кормление грудью.	2026-09-29 23:40:48.171842	5 мл (1 ч.л.)	Поддержка суставов и хрящевой ткани.	0.00	Взрослым по 5 мл (1 ч. ложка) 1 раз в день во время еды.	Жидкость	["Коллаген+", "Хондроитин", "Уменьшает воспаление"]	Дегенеративно-дистрофические заболевания суставов и позвоночника, остеоартрозы, остеохондроз.	t	f	AD Medicine	235	5026.00	100	Артро Комплекс	мл	3	3
6	RU.77.99.11.003.R.001068.04.23	Глицерин, вода, нектар агавы, экстракты косточек грейпфрута, гвоздики, душицы, черного ореха, имбиря, пижмы.	Индивидуальная непереносимость; беременность и кормление грудью.	2026-09-29 23:40:48.186753	5 мл (1 ч.л.)	Программа биологической очистки организма.	0.00	Взрослым по 5 мл 1 раз в день во время еды.	Жидкость	["Комплекс ферментов", "Выведение шлаков", "Улучшение пищеварения"]	Гельминтозы, инвазия простейшими, микозы, бактериозы, дисбактериоз.	t	f	AD Medicine	235	5026.00	100	Биоклинзинг	мл	4	3
7	RU.77.99.11.003.R.001094.04.23	Глицерин, вода, лецитин, L-карнитин, омега 3, экстракт зеленого чая, витамины группы В.	Индивидуальная непереносимость; беременность и кормление грудью.	2026-09-29 23:40:48.199939	5 мл (1 ч.л.)	Комплекс для повышения концентрации и памяти.	0.00	Взрослым по 5 мл 1 раз в день во время еды.	Жидкость	["Улучшает память", "Повышает концентрацию", "Антиоксидантное действие"]	Заболевания ЦНС, инсульт, энцефалопатия, нарушение памяти, стресс, депрессия.	t	f	AD Medicine	235	5026.00	100	Брейн Бустер	мл	2	3
8	AM.01.07.01.003.R.001528.09.23	Вода, глицерин, экстракт алоэ-вера, мяты, витамин С, цинк карнозин, витамин U, глицин, солодка, куркума.	Индивидуальная непереносимость; беременность и кормление грудью.	2026-09-29 23:40:48.199939	5 мл (1 ч.л.)	Биокомплекс для поддержки ЖКТ и микрофлоры.	0.00	Взрослым по 5 мл 1 раз в день во время еды.	Жидкость	["Пробиотики", "Пребиотики", "Ферменты пищеварения"]	Гастрит, язвенная болезнь, ГЭРБ, функциональные расстройства ЖКТ.	t	f	AD Medicine	235	5026.00	100	Гастро Комплекс	мл	4	3
9	RU.77.99.11.003.Е.002491.08.23	Глицерин, вода, нектар агавы, хлорелла, кальция цитрат, витамин С, лецитин, масло сафлоровое.	Беременность, кормление грудью, обострение заболеваний ЖКТ.	2026-09-29 23:40:48.219622	5 мл (1 ч.л.)	Эффективное очищение организма и печени.	0.00	Взрослым по 5 мл 1 раз в день во время еды.	Жидкость	["Глубокое очищение печени", "Выводит токсины", "Коллоидная технология"]	Хронические заболевания ЖКТ, эндогенная интоксикация, аллергии, дисбактериоз.	t	f	AD Medicine	235	5026.00	100	Детокс - коллоидная фитоформула	мл	4	3
10	KZ.16.01.78.003.Е.001243.12.16	Цеолит природный.	Язвенная болезнь в стадии обострения, непереносимость компонентов.	2026-09-29 23:40:48.224425	1,25 гр (1/2 ч.л.)	Природный энтеросорбент и энзимный комплекс.	0.00	По 0,5 чайной ложки порошка 2 раза в день, запивать водой.	Сыпучка (граммы)	["Природный цеолит", "Улучшает обмен веществ", "Долгий срок действия"]	Аллергические заболевания, псориаз, снятие отравлений, иммуномодулятор.	t	f	ЗАО НПФ «Новь», г. Новосибирск	150	1619.00	100	Литовит-М	гр	1	4
11	KZ.16.01.78.003.Е.001246.12.16	Цеолит природный - 50%, Диатомит природный - 50%.	Острые и хронические заболевания почек, обострение язвенной болезни.	2026-09-29 23:40:48.233067	1 пакетик	Эффективный энтеросорбент при интоксикации и аллергиях	0.00	Взрослым по 1 пакету (2,5 г) 2 раза в день.	Пакетики	["Быстро выводит токсины", "Устраняет аллергенные комплексы", "Безопасен для детей"]	Для нормализации минерального обмена; при отравлениях.	t	f	ЗАО НПФ «Новь», г. Новосибирск	10	1802.00	100	Оптисорб	пакетик	1	4
12	AM.01.01.01.003.R.000853.12.22	Концентрированный экстракт травы солянки холмовой, вспомогательное вещество: глюкоза.	Беременность, кормление грудью, сахарный диабет.	2026-09-29 23:40:48.244932	2 гр (1 ч.л.)	Комплекс для восстановления печени и желчевыводящих путей.	0.00	Взрослым по 2 г гранул 3 раза в день до еды.	Сыпучка (граммы)	["Защита печени", "Улучшение желчеотделения", "Антиоксидантная защита"]	Гепатиты, холециститы, начальные стадии цирроза, описторхоз.	t	f	Компания Биолит, г. Томск	300	2442.00	100	Гепатосол	гр	1	5
13	ЕАЭС N RU Д-RU.РА04.В.20081/22	Вода, глицерин, экстракт календулы, родиолы розовой, манжетки, солодки, аспарагин, эфирные масла.	Индивидуальная непереносимость компонентов.	2026-09-29 23:40:48.25744	Наружно	Поливитаминный комплекс для беременных и кормящих	0.00	Наносить небольшое количество геля на чистую кожу 2 раза в день.	Гель/крем	["Фолиевая кислота", "Железо и кальций", "Омега-3 для развития плода", "Поддержка лактации"]	Профилактика мастопатий, поддержание формы груди.	t	f	Компания Биолит, г. Томск	50	542.00	100	Мамавит	мл	3	5
14	AM.01.11.01.003.R.000548.09.24	Шелуха семян подорожника, сорбит, экстракт корней лопуха, пектин яблочный, экстракты свеклы, сенны, ромашки, укропа.	Беременность, кишечная непроходимость, обострение заболеваний ЖКТ.	2026-09-29 23:40:48.26647	1 стик (5 гр)	Легкая формула для мягкой детоксикации кишечника	0.00	Взрослым по 5 г (1 стик) 2 раза в день перед приемом пищи.	Стики	["Мягкое очищение", "Нормализация стула", "Без боли и дискомфорта"]	Запоры, диарея, синдром раздраженного кишечника, дисбактериоз.	t	f	Компания Биолит, г. Томск	14	1950.00	100	Очищение Актив Лайт - 1 этап	стик	3	5
15	AM.01.11.01.003.R.000548.09.24	Эритритол, экстракты солянки холмовой, солодки, хвоща, лопуха, березы, сок клюквы, экстракт каштана.	Беременность, хроническая почечная недостаточность, язвенная болезнь.	2026-09-29 23:40:48.2732	1 стик (5 гр)	Комплекс для улучшения лимфотока и уменьшения отеков	0.00	Взрослым по 5 г (1 стик) 2 раза в день в первой половине дня.	Стики	["Улучшает отток лимфы", "Снижает отечность", "Укрепляет сосуды"]	Отеки различного происхождения, программы очищения и снижения веса.	t	f	Компания Биолит, г. Томск	20	2431.00	100	Лимфодренаж Актив - 2 этап	стик	3	5
16	ЕАЭС N RU Д-RU.РА01.В.11074/21	Экстракт концентрированный корней лопуха большого.	Индивидуальная непереносимость, беременность и кормлению грудью.	2026-09-29 23:40:48.282944	2,5 мл (1/2 ч.л.)	Концентрированный экстракт лопуха для ЖКТ и очищения печени.	0.00	Взрослым по 2,0 г (1/2 ч.л.) 3 раза в день до еды.	Жидкость	["Мягкое желчегонное действие", "Улучшаeт обмен веществ", "Детоксикация организма"]	Отравления, нарушения обмена веществ, заболевания ЖКТ, кожные заболевания.	t	f	Компания Биолит, г. Томск	75	1195.00	100	Экстракт корня лопуха - 75 мл	мл	1	5
17	ЕАЭС N RU Д-RU.РА01.В.11074/21	Экстракт корня лопуха содержит полисахарид инулин, протеин, эфирное бардановое масло, дубильные вещества, микроэлементы.	Индивидуальная непереносимость компонентов.	2026-09-29 23:40:48.282944	2,5 мл (1/2 ч.л.)	Двойная доза для длительного курса лечения ЖКТ.	0.00	1/2 ч. л. экстракта растворить в 100 мл теплой воды, 3 раза в день до еды.	Жидкость	["Длительный курс", "Поддержка печени", "Детокс организма"]	Отравления, нарушения обмена веществ, заболевания ЖКТ, кожные заболевания.	t	f	Компания Биолит, г. Томск	200	2768.00	100	Экстракт корня лопуха - 200 мл	мл	1	5
18	KZ.16.01.78.003.Е.005069.09.15	Экстракты коры осины, травы володушки золотистой, вспомогательное вещество: глюкоза.	Сахарный диабет, беременность и кормление грудью.	2026-09-29 23:40:48.299783	6 гр (3 ч.л.)	Улучшает работу печени при описторхозе.	0.00	Взрослым по 3 чайных ложки гранул 3 раза в день после еды.	Сыпучка (граммы)	["Комплекс антиоксидантов", "Укрепляет иммунитет", "Снижает воспаление", "Органический состав"]	Острый и хронический описторхоз, дискинезия желчного пузыря.	t	f	Компания Биолит, г. Томск	120	1377.00	100	Экорсол - 120 гр	гр	1	5
19	KZ.16.01.78.003.Е.005069.09.15	Сухие экстракты коры осины, травы володушки золотистой; вспомогательные вещества: МКЦ, тальк, аэросил.	Беременность и кормление грудью.	2026-09-29 23:40:48.314566	3 капсулы	Капсулы для детоксикации и поддержки печени	0.00	Взрослым по 3 капсулы 3 раза в день во время еды.	Капсулы	["Длительное действие", "Поддержка работы печени", "Коллоидная формула"]	Острый и хронический описторхоз, дискинезия желчного пузыря.	t	f	Компания Биолит, г. Томск	90	1867.00	100	Экорсол - 90 капсул	капс	1	5
20	KZ.16.01.78.003.Е.004713.08.15	Концентрированный водный экстракт коры осины, дигидрокверцетин (лавитол).	Индивидуальная непереносимость компонентов.	2026-09-29 23:40:48.324581	5 мл (1 ч.л.)	Жидкий густой экстракт коры осины для иммунитета	0.00	Взрослым по 1 ч. л. 1 раз в день во время еды.	Жидкость	["Поддержка иммунитета", "Антибактериальный эффект", "Ускоряет обмен веществ", "Дигидрокверцетин"]	Описторхоз, туберкулез, ОРВИ, бронхиты, сахарный диабет.	t	f	Компания Биолит, г. Томск	75	1685.00	100	Популин с дигидрокверцетином - 75 мл	мл	1	5
21	KZ.16.01.78.003.Е.004713.08.15	Концентрированный водный экстракт коры осины, дигидрокверцетин (лавитол).	Индивидуальная непереносимость компонентов.	2026-09-29 23:40:48.333133	5 мл (1 ч.л.)	Увеличенный объем густого экстракта коры осины.	0.00	Взрослым по 1 ч. л. 1 раз в день во время еды.	Жидкость	["Большая упаковка", "Дигидрокверцетин", "Укрепление иммунитета"]	Описторхоз, туберкулез, ОРВИ, бронхиты, сахарный диабет.	t	f	Компания Биолит, г. Томск	200	3643.00	100	Популин с дигидрокверцетином 200 мл	мл	1	5
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, created_at, is_approved, rating, text, product_id, user_id) FROM stdin;
\.


--
-- Data for Name: user_medicines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_medicines (id, added_at, custom_title, custom_unit, is_custom, taken_units, total_units, product_id, user_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, avatar_url, created_at, email, password, phone, role, token_version, username) FROM stdin;
1	\N	2026-09-29 23:40:47.779809	admin@sansoll.com	$2a$10$6JXWLcgo2ge0KAVvfsDJfut.1MOltn7l6vppdBft.HsjoG5tOYs0S	\N	ADMIN	0	ADMIN_228_1
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 4, true);


--
-- Name: certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificates_id_seq', 30, true);


--
-- Name: login_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_logs_id_seq', 1, false);


--
-- Name: medicine_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medicine_schedules_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.partners_id_seq', 5, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 78, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 21, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: user_medicines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_medicines_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: login_logs login_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT login_logs_pkey PRIMARY KEY (id);


--
-- Name: medicine_schedules medicine_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine_schedules
    ADD CONSTRAINT medicine_schedules_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews uk1nv3auyahyyy79hvtrcqgtfo9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT uk1nv3auyahyyy79hvtrcqgtfo9 UNIQUE (user_id, product_id);


--
-- Name: users uk_6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: orders uk_mp0mfkk2py3ym2r3tap78milx; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT uk_mp0mfkk2py3ym2r3tap78milx UNIQUE (track_number);


--
-- Name: categories uk_oul14ho7bctbefv8jywp5v3i2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT uk_oul14ho7bctbefv8jywp5v3i2 UNIQUE (slug);


--
-- Name: users uk_r43af9ap4edm43mmtq01oddj6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username);


--
-- Name: user_medicines user_medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_medicines
    ADD CONSTRAINT user_medicines_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_medicines fk2q12rshvsdmv7auvntq620ycv; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_medicines
    ADD CONSTRAINT fk2q12rshvsdmv7auvntq620ycv FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders fk32ql8ubntj5uh44ph9659tiih; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk32ql8ubntj5uh44ph9659tiih FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: login_logs fk6bgjhgih3ewicdsp98bkq3wtl; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT fk6bgjhgih3ewicdsp98bkq3wtl FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_items fkbioxgbv59vetrxe0ejfubep1w; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkbioxgbv59vetrxe0ejfubep1w FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: reviews fkcgy7qjc1r99dp117y9en6lxye; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fkcgy7qjc1r99dp117y9en6lxye FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_medicines fkfynjrnxxtotdfr2vn2qktstn4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_medicines
    ADD CONSTRAINT fkfynjrnxxtotdfr2vn2qktstn4 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: products fkl2kvlko431wmdxenpli4w1ahi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fkl2kvlko431wmdxenpli4w1ahi FOREIGN KEY (partner_id) REFERENCES public.partners(id);


--
-- Name: order_items fkocimc7dtr037rh4ls4l95nlfi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkocimc7dtr037rh4ls4l95nlfi FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products fkog2rp4qthbtt2lfyhfo32lsw9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fkog2rp4qthbtt2lfyhfo32lsw9 FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: reviews fkpl51cejpw4gy5swfar8br9ngi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fkpl51cejpw4gy5swfar8br9ngi FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_images fkqnq71xsohugpqwf3c9gxmsuy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT fkqnq71xsohugpqwf3c9gxmsuy FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: medicine_schedules fkrour76ctg3i31qrrw2cluhxn; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine_schedules
    ADD CONSTRAINT fkrour76ctg3i31qrrw2cluhxn FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: medicine_schedules fks4g9x69wd7uoxabb06nddftv1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine_schedules
    ADD CONSTRAINT fks4g9x69wd7uoxabb06nddftv1 FOREIGN KEY (user_medicine_id) REFERENCES public.user_medicines(id);


--
-- PostgreSQL database dump complete
--

\unrestrict ksf4pP242Y47R0YrUa34wX6eQfdq1cnAa7Pn153F26roxs7fXvxFDsocykoSHMQ

