/* ==========================================================================
   data.js — Contenido reutilizable de la presentación
   --------------------------------------------------------------------------
   Aquí vive el texto que aparece en más de un componente (gráfica, tabla
   comparativa, indicadores, ficha, glosario, cuestionario y fuentes).
   Para citar una fuente dentro de un texto escribe {{clave}}, por ejemplo
   {{openstax-94}}. La numeración se calcula según el orden de «sources».
   ========================================================================== */
(function (ns) {
  "use strict";

  ns.data = {
    /* ------------------------------------------------------------------
       Datos opcionales. Si se dejan vacíos, no se muestran.
       ------------------------------------------------------------------ */
    meta: {
      team: "",       // Ej.: "Ana López, Luis Pérez y María Gómez"
      course: "",     // Ej.: "Fundamentos de Marketing · Grupo 3"
      institution: "",// Ej.: "Universidad …"
      accessed: "25 de octubre de 2026",
    },

    /* ------------------------------------------------------------------
       Créditos de las imágenes (sección «Fuentes y créditos»).
       ------------------------------------------------------------------ */
    imageCredits: [
      {
        what: "Empaques 3D sabor chocolate (portada, Producto, versiones, ficha, índice e ícono)",
        credit: "Imagen del diseño del empaque aportada por el equipo; recortada, sin fondo y convertida a PNG",
        url: "",
      },
      {
        what: "Empaque sabor chocolate en una mano (portada)",
        credit: "Fotografía de la petición «Que vuelva el triangulito a Colombia», Change.org (2023)",
        url: "https://www.change.org/p/que-vuelva-el-triangulito-a-colombia",
      },
      {
        what: "Triangulito de chocolate fuera del empaque (recuadro en Producto)",
        credit: "Fotograma del comercial de Triangulito chocolate para Ecuador, publicado en YouTube por AXXO ART",
        url: "https://www.youtube.com/watch?v=DX5r_yv8faU",
      },
      {
        what: "Bonice Doble (versiones)",
        credit: "«BonIce es Mio», de Juan Manuel Osomodkkd, Wikimedia Commons. Licencia CC BY-SA 4.0; imagen recortada y compartida con la misma licencia",
        url: "https://commons.wikimedia.org/wiki/File:BonIce_es_Mio.jpg",
        license: "https://creativecommons.org/licenses/by-sa/4.0/deed.es",
      },
      {
        what: "Vendedores de Bonice (etapa de crecimiento)",
        credit: "Fotografía de Alto Nivel publicada en Emprendedor (2023)",
        url: "https://emprendedor.com/por-que-estan-desapareciendo-de-mexico-los-vendedores-de-bonice/",
      },
    ],

    /* ------------------------------------------------------------------
       Fuentes realmente consultadas. «supports» describe qué afirmaciones
       respalda cada una; se muestra en la sección de fuentes.
       ------------------------------------------------------------------ */
    sourceGroups: [
      { id: "teoria", title: "Marco teórico" },
      { id: "producto", title: "El Triangulito" },
      { id: "marca", title: "La marca Bonice y la empresa Quala" },
    ],

    sources: [
      {
        key: "openstax-93",
        group: "teoria",
        shortAuthor: "Gomez Albrecht et al.",
        author: "Gomez Albrecht, M., Green, M. y Hoffman, L.",
        year: "2023",
        date: "25 de enero de 2023",
        title: "9.3 The Product Life Cycle",
        container: "Principles of Marketing. OpenStax (Rice University)",
        url: "https://openstax.org/books/principles-marketing/pages/9-3-the-product-life-cycle",
        supports: "Definición de las cuatro etapas; utilidades bajas en la introducción; imitadores en el crecimiento; la madurez como etapa más larga; productos que no recorren todas las etapas.",
      },
      {
        key: "openstax-94",
        group: "teoria",
        shortAuthor: "Gomez Albrecht et al.",
        author: "Gomez Albrecht, M., Green, M. y Hoffman, L.",
        year: "2023",
        date: "25 de enero de 2023",
        title: "9.4 Marketing Strategies at Each Stage of the Product Life Cycle",
        container: "Principles of Marketing. OpenStax (Rice University)",
        url: "https://openstax.org/books/principles-marketing/pages/9-4-marketing-strategies-at-each-stage-of-the-product-life-cycle",
        supports: "Estrategias por etapa: descremado y penetración; ampliación de la distribución; modificación del mercado y del producto; cosecha y desinversión (vender o descontinuar un producto).",
      },
      {
        key: "levitt-1965",
        group: "teoria",
        shortAuthor: "Levitt",
        author: "Levitt, T.",
        year: "1965",
        date: "noviembre de 1965",
        title: "Exploit the Product Life Cycle",
        container: "Harvard Business Review",
        url: "https://hbr.org/1965/11/exploit-the-product-life-cycle",
        supports: "Observación de que los directivos conocían el concepto, pero en su encuesta ninguno lo usaba de forma estratégica y muy pocos de forma táctica.",
      },
      {
        key: "dhalla-1976",
        group: "teoria",
        shortAuthor: "Dhalla y Yuspeh",
        author: "Dhalla, N. K. y Yuspeh, S.",
        year: "1976",
        date: "enero-febrero de 1976",
        title: "Forget the Product Life Cycle Concept!",
        container: "Harvard Business Review",
        url: "https://hbr.org/1976/01/forget-the-product-life-cycle-concept",
        supports: "Crítica al uso del modelo como guía de decisión (el artículo abre con una marca estancada a la que se le negó inversión).",
      },
      {
        key: "informador-2024",
        group: "producto",
        shortAuthor: "Borja",
        author: "Borja, L.",
        year: "2024",
        date: "25 de agosto de 2024",
        title: "Dulces que marcaron nuestra infancia, pero que ya no existen",
        container: "El Informador",
        url: "https://www.informador.mx/entretenimiento/Dulces-que-marcaron-nuestra-infancia-pero-que-ya-no-existen-20240820-0091.html",
        supports: "El «triángulo de chocolate» de Bonice figura entre los dulces que ya no existen o son muy difíciles de encontrar; «no ha podido regresar»; rumores (no confirmados) sobre su retiro: empaque triangular complicado y costoso, cuyas esquinas podían lastimar. Ejemplo de regreso temporal: Paleta Vampiro.",
      },
      {
        key: "youtube-2015",
        group: "producto",
        shortAuthor: "Agencia Bodyart",
        author: "Agencia Bodyart",
        year: "s. f.",
        date: "sin fecha de publicación visible; el título fecha el comercial en 2015",
        title: "Comercial BonIce, «Triangulito Sabor a Galleta/Chocogalleta», 2015 [video]",
        container: "YouTube",
        url: "https://www.youtube.com/watch?v=u1sSLw79Dz8",
        supports: "Existencia de un comercial del Triangulito sabor galleta o chocogalleta, fechado en 2015 por quien lo publicó.",
      },
      {
        key: "vimeo-arequipe",
        group: "producto",
        shortAuthor: "Quala Colombia",
        author: "Buzzalino, N. (director); Quala Colombia (cliente)",
        year: "s. f.",
        date: "sin fecha",
        title: "Bonice Triangulito Arequipe [comercial]",
        container: "Vimeo",
        url: "https://vimeopro.com/gofilmss/alimentos-y-bebidas/video/217670898",
        supports: "Existencia de una versión del Triangulito sabor arequipe anunciada para Quala Colombia.",
      },
      {
        key: "axxo-colombia",
        group: "producto",
        shortAuthor: "AXXO ART",
        author: "AXXO ART Arte que da vida",
        year: "s. f.",
        date: "sin fecha",
        title: "Creación y animación de títeres comercial BonIce triangulito chocolate Colombia [video]",
        container: "YouTube",
        url: "https://www.youtube.com/watch?v=Tv7KGgLi3wo",
        supports: "Existencia de un comercial del Triangulito sabor chocolate para Colombia (video del estudio que hizo los títeres).",
      },
      {
        key: "axxo-ecuador",
        group: "producto",
        shortAuthor: "AXXO ART",
        author: "AXXO ART Arte que da vida",
        year: "s. f.",
        date: "sin fecha",
        title: "Creación y animación de títeres comercial BonIce triangulito chocolate Ecuador [video]",
        container: "YouTube",
        url: "https://www.youtube.com/watch?v=DX5r_yv8faU",
        supports: "Existencia de un comercial del Triangulito sabor chocolate para Ecuador; un fotograma muestra el producto.",
      },
      {
        key: "change-2023",
        group: "producto",
        shortAuthor: "Gaitan",
        author: "Gaitan, E.",
        year: "2023",
        date: "24 de agosto de 2023",
        title: "Que vuelva el triangulito a Colombia [petición]",
        container: "Change.org",
        url: "https://www.change.org/p/que-vuelva-el-triangulito-a-colombia",
        supports: "Petición para que el Triangulito vuelva a Colombia; tenía 6 firmas al consultarla.",
      },
      {
        key: "wiki-bonice",
        group: "marca",
        shortAuthor: "Wikipedia",
        author: "Wikipedia",
        year: "2026",
        date: "versión del 24 de abril de 2026",
        title: "BonIce",
        container: "Wikipedia, la enciclopedia libre",
        url: "https://es.wikipedia.org/wiki/BonIce",
        supports: "Bonice es una marca de helados de agua de Quala, creada en 1998; llegó a la Ciudad de México en 2004, a Guadalajara y Villahermosa en 2005 y a Monterrey y Tijuana en 2006; hoy está en más de cien ciudades; venta en la calle mediante vendedores independientes bajo franquicia; versiones con yogur y Bonice Doble.",
      },
      {
        key: "wiki-quala",
        group: "marca",
        shortAuthor: "Wikipedia",
        author: "Wikipedia",
        year: "2026",
        date: "versión del 31 de mayo de 2026",
        title: "Quala",
        container: "Wikipedia, the free encyclopedia",
        url: "https://en.wikipedia.org/wiki/Quala",
        supports: "Quala fue fundada en 1980 en Bogotá, Colombia, por Michael de Rhodes.",
      },
      {
        key: "emprendedor-2022",
        group: "marca",
        shortAuthor: "Emprendedor",
        author: "Equipo Editorial",
        year: "2022",
        date: "18 de abril de 2022",
        title: "El nuevo refresco Mexicana no es 100 % nacional, mira qué empresa lo produce",
        container: "Emprendedor",
        url: "https://emprendedor.com/nuevo-refresco-mexicana-no-es-mexicano-quien-lo-produce-quala-bonice/",
        supports: "Quala exploró México desde 2003, inició operaciones en febrero de 2004 y abrió en Toluca su primera planta fuera de Colombia; fabricó BonIce en México desde junio de 2004.",
      },
      {
        key: "expansion-2024",
        group: "marca",
        shortAuthor: "Rodríguez",
        author: "Rodríguez, J.",
        year: "2024",
        date: "23 de agosto de 2024",
        title: "¿Quién es el dueño de Vive 100?",
        container: "Expansión",
        url: "https://expansion.mx/empresas/2024/08/23/quien-es-el-dueno-de-vive-100",
        supports: "BonIce fue el primer producto de Quala en México (2004); después llegaron marcas como Gelafrut, Frutimax y Vive 100.",
      },
      {
        key: "emprendedor-2023",
        group: "marca",
        shortAuthor: "Alto Nivel",
        author: "Alto Nivel",
        year: "2023",
        date: "13 de marzo de 2023",
        title: "¿Por qué están desapareciendo de México los vendedores de BonIce?",
        container: "Emprendedor",
        url: "https://emprendedor.com/por-que-estan-desapareciendo-de-mexico-los-vendedores-de-bonice/",
        supports: "Llegada a la Ciudad de México en agosto de 2004 con vendedores vestidos de azul y carritos; precio inicial de 2.50 pesos; rumor de que el vendedor ganaba 50 centavos por pieza; los vendedores escasean y las explicaciones son teorías (pandemia, poca ganancia, restricciones al comercio ambulante); fecha la creación de la marca en 1989.",
      },
    ],

    /* ------------------------------------------------------------------
       Etapas del modelo. Los colores se definen en CSS ([data-stage]).
       «range» son las fronteras en la curva conceptual (0 = inicio, 1 = fin).
       ------------------------------------------------------------------ */
    stages: [
      {
        number: 1,
        id: "introduccion",
        name: "Introducción",
        icon: "i-sprout",
        range: [0, 0.214],
        sales: "Bajas y de crecimiento lento: el mercado apenas conoce el producto.",
        profit: "Negativas o bajas por los costos de lanzamiento {{openstax-93}}.",
        objective: "Dar a conocer el producto y provocar la primera compra.",
        challenges: "Lograr distribución y prueba; recuperar la inversión.",
        strategy: "Promoción intensa para generar conocimiento y prueba, con precio de penetración o de descremado según el mercado {{openstax-94}}.",
        indicators: [
          { label: "Ventas", level: 1, text: "Bajas" },
          { label: "Utilidades", level: 1, text: "Negativas o bajas" },
          { label: "Competencia", level: 1, text: "Escasa" },
          { label: "Inversión en promoción", level: 5, text: "Muy alta" },
        ],
      },
      {
        number: 2,
        id: "crecimiento",
        name: "Crecimiento",
        icon: "i-trend-up",
        range: [0.214, 0.45],
        sales: "Aumentan con rapidez porque más consumidores aceptan y recompran el producto.",
        profit: "Aumentan al repartir los costos entre más unidades vendidas.",
        objective: "Ganar participación de mercado y construir preferencia de marca.",
        challenges: "Escalar sin perder calidad; enfrentar a los imitadores {{openstax-93}}.",
        strategy: "Ampliar la distribución, mejorar el producto y pasar de mensajes de conocimiento a mensajes de preferencia {{openstax-94}}.",
        indicators: [
          { label: "Ventas", level: 4, text: "En rápido aumento" },
          { label: "Utilidades", level: 4, text: "En aumento" },
          { label: "Competencia", level: 3, text: "Creciente" },
          { label: "Inversión en promoción", level: 4, text: "Alta" },
        ],
      },
      {
        number: 3,
        id: "madurez",
        name: "Madurez",
        icon: "i-plateau",
        range: [0.45, 0.756],
        sales: "Crecen poco, se estabilizan y alcanzan su punto máximo.",
        profit: "Se estancan y empiezan a bajar por la presión competitiva {{openstax-93}}.",
        objective: "Defender la participación y la rentabilidad.",
        challenges: "Diferenciarse en un mercado saturado; proteger el margen.",
        strategy: "Diferenciar y fidelizar; modificar el mercado (nuevos clientes) o el producto (ajustarlo a lo que pide el mercado) {{openstax-94}}.",
        indicators: [
          { label: "Ventas", level: 5, text: "Máximas, crecen poco" },
          { label: "Utilidades", level: 3, text: "Estables o a la baja" },
          { label: "Competencia", level: 5, text: "Intensa" },
          { label: "Inversión en promoción", level: 3, text: "Defensiva" },
        ],
      },
      {
        number: 4,
        id: "declive",
        name: "Declive",
        icon: "i-trend-down",
        range: [0.756, 1],
        sales: "Disminuyen de forma sostenida y significativa {{openstax-93}}.",
        profit: "Disminuyen; el producto puede dejar de ser rentable.",
        objective: "Decidir si conviene renovar, reposicionar, cosechar o retirar.",
        challenges: "Decidir a tiempo; evitar que las pérdidas afecten al portafolio.",
        strategy: "Reducir costos y concentrarse en lo esencial, cosechar o desinvertir; renovar si aún existe demanda recuperable {{openstax-94}}.",
        indicators: [
          { label: "Ventas", level: 2, text: "En descenso" },
          { label: "Utilidades", level: 1, text: "Bajas" },
          { label: "Competencia", level: 2, text: "Menor" },
          { label: "Inversión en promoción", level: 1, text: "Mínima" },
        ],
      },
    ],

    /* ------------------------------------------------------------------
       Ficha del producto (sección Producto y panel «Ficha»).
       ------------------------------------------------------------------ */
    productSheet: [
      { label: "Producto", value: "Triangulito de Bonice, también recordado como «triángulo de Bonice» {{informador-2024}}" },
      { label: "Marca", value: "Bonice (BonIce), marca de helados de agua {{wiki-bonice}}" },
      { label: "Fabricante", value: "Quala, multinacional colombiana fundada en 1980 {{wiki-quala}}; opera en México desde 2004, con planta en Toluca {{emprendedor-2022}}" },
      { label: "Tipo de producto", value: "Postre congelado individual en empaque triangular {{informador-2024}}" },
      { label: "Sabores documentados", value: "Chocolate, con comerciales para Colombia y Ecuador {{axxo-colombia}} {{axxo-ecuador}}; galleta o chocogalleta {{youtube-2015}}; y arequipe, anunciado en Colombia {{vimeo-arequipe}}" },
      { label: "Canal de la marca", value: "Venta en la calle mediante vendedores independientes {{wiki-bonice}} {{emprendedor-2023}}" },
      { label: "Situación actual", value: "Ya no se encuentra en el mercado, según la prensa; no hay comunicado oficial del retiro {{informador-2024}}" },
      { label: "Fuera del análisis", value: "Los hielitos Bonice tradicionales, que siguen a la venta {{wiki-bonice}}" },
    ],

    /* ------------------------------------------------------------------
       Glosario (panel lateral).
       ------------------------------------------------------------------ */
    glossary: [
      { id: "penetracion", term: "Precio de penetración", text: "Precio bajo para ganar volumen y participación de mercado con rapidez {{openstax-94}}." },
      { id: "descremado", term: "Descremado", text: "Precio alto al inicio. En el descremado rápido se acompaña de mucha promoción; en el lento, de poca inversión promocional {{openstax-94}}." },
      { id: "modificacion-mercado", term: "Modificación del mercado", text: "Llevar el mismo producto a nuevos clientes o segmentos {{openstax-94}}." },
      { id: "modificacion-producto", term: "Modificación del producto", text: "Alterar el producto (sabor, empaque, tamaño) para ajustarlo a lo que pide el mercado {{openstax-94}}." },
      { id: "cosecha", term: "Cosecha", text: "Reducir todos los gastos no indispensables para conservar los ingresos que el producto aún genera {{openstax-94}}." },
      { id: "desinversion", term: "Desinversión", text: "Vender o descontinuar un producto para proteger al resto del portafolio {{openstax-94}}." },
      { id: "descontinuacion", term: "Producto descontinuado", text: "Producto que la empresa deja de fabricar o vender. Puede ocurrir aunque la marca siga en el mercado con otros productos." },
      { id: "edicion-limitada", term: "Regreso por tiempo limitado", text: "Volver a vender un producto descontinuado durante un periodo corto, por ejemplo para aprovechar la nostalgia. La Paleta Vampiro regresó así después de dejar de venderse {{informador-2024}}." },
      { id: "sustituto", term: "Producto sustituto", text: "Producto distinto que satisface la misma necesidad; por ejemplo, otras paletas, helados o aguas frescas frente a un postre congelado." },
      { id: "venta-ambulante", term: "Venta en la calle", text: "Canal en el que vendedores independientes ofrecen el producto directamente al consumidor. Es el canal característico de Bonice {{wiki-bonice}}." },
    ],

    /* ------------------------------------------------------------------
       Respuestas estratégicas en el declive (comparador de la etapa 4).
       «selected» marca la opción que se muestra primero.
       ------------------------------------------------------------------ */
    declineOptions: [
      {
        id: "renovar",
        name: "Renovar",
        icon: "i-refresh",
        what: "Mejorar o rediseñar el producto: sabor, empaque o tamaño.",
        when: "La demanda existe, pero el producto es caro de producir o ya no cumple con lo que pide el consumidor.",
        risk: "Perder el rasgo que lo hacía reconocible, como su forma.",
        product: "No encontramos evidencia de un rediseño ni de un regreso confirmado oficialmente.",
      },
      {
        id: "reposicionar",
        name: "Reposicionar",
        icon: "i-target",
        what: "Cambiar la percepción del producto o dirigirlo a otro segmento.",
        when: "Existe un grupo que lo valora por otras razones, como la nostalgia.",
        risk: "Que el entusiasmo en redes no se convierta en compras.",
        product: "<strong>Propuesta hipotética:</strong> un regreso por tiempo limitado dirigido a adultos nostálgicos, como hizo Nestlé con la Paleta Vampiro {{informador-2024}}.",
      },
      {
        id: "cosechar",
        name: "Cosechar",
        icon: "i-basket",
        what: "Reducir los gastos no indispensables para conservar los ingresos restantes {{openstax-94}}.",
        when: "El producto todavía vende, pero ya no justifica nuevas inversiones.",
        risk: "Acelerar la caída al perder visibilidad.",
        product: "No encontramos evidencia de que se haya aplicado antes del retiro.",
      },
      {
        id: "retirar",
        name: "Retirar",
        icon: "i-exit",
        selected: true,
        what: "Descontinuar o vender el producto para proteger al resto del portafolio {{openstax-94}}.",
        when: "Las pérdidas persisten o el producto es demasiado costoso de mantener.",
        risk: "Perder clientes leales y dejar una demanda nostálgica sin atender.",
        product: "<strong>Lo que ocurrió:</strong> según la prensa, el triángulo de chocolate no ha regresado al mercado {{informador-2024}}, mientras la marca Bonice sigue a la venta {{wiki-bonice}}.",
      },
    ],

    /* ------------------------------------------------------------------
       Cuestionario final. «answer» es el índice de la opción correcta.
       ------------------------------------------------------------------ */
    quiz: [
      {
        question: "Una marca lanza un helado nuevo. Poca gente lo conoce, se vende en pocos lugares y la empresa invierte mucho en publicidad y degustaciones. ¿En qué etapa está?",
        options: ["Introducción", "Crecimiento", "Madurez", "Declive"],
        answer: 0,
        explanation: "Ventas bajas, distribución limitada y una fuerte inversión para generar conocimiento y prueba son rasgos de la introducción.",
      },
      {
        question: "Las ventas aumentan con rapidez, la marca llega a nuevas ciudades y otras empresas empiezan a lanzar productos parecidos. ¿Qué etapa describe esta situación?",
        options: ["Introducción", "Crecimiento", "Madurez", "Declive"],
        answer: 1,
        explanation: "En el crecimiento, el éxito atrae a imitadores. La empresa amplía la distribución y busca que el consumidor prefiera su marca.",
      },
      {
        question: "Un helado conocido por todos lanza un sabor nuevo para mantener el interés de sus compradores. ¿Qué estrategia de madurez aplica?",
        options: ["Modificación del mercado", "Modificación del producto", "Precio de descremado", "Cosecha"],
        answer: 1,
        explanation: "Modificar el producto es cambiarlo (sabor, empaque, tamaño) para ajustarlo al mercado. La modificación del mercado, en cambio, lleva el mismo producto a nuevos clientes.",
      },
      {
        question: "Una empresa deja de fabricar un formato costoso y poco rentable para proteger al resto de sus productos. ¿Cómo se llama esa decisión?",
        options: ["Cosecha", "Desinversión", "Penetración", "Modificación del mercado"],
        answer: 1,
        explanation: "La desinversión implica vender o descontinuar un producto para proteger el portafolio. La cosecha, en cambio, mantiene el producto a la venta mientras reduce sus gastos.",
      },
      {
        question: "Si un producto fue descontinuado, ¿significa que su marca desapareció?",
        options: [
          "Sí, el declive de un producto siempre arrastra a toda la marca.",
          "No: el declive puede afectar a un producto o formato mientras la marca sigue en el mercado.",
          "Solo si la marca es extranjera.",
          "Solo si el producto nunca tuvo publicidad.",
        ],
        answer: 1,
        explanation: "Cada producto tiene su propio ciclo. El Triangulito dejó de venderse, pero la marca Bonice sigue en el mercado con otros productos.",
      },
    ],
  };
})(window.CicloVida);
