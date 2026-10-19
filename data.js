// ==========================================
// 1. TEORIA DO STORY GENIUS
// ==========================================
const STORY_GENIUS_THEORY = [
    {
        title: "1. A Neurociência da Narrativa",
        content: "O cérebro humano não processa histórias como simples entretenimento passivo, mas como simulações cognitivas de sobrevivência. Ler sobre os dilemas de um personagem ativa as mesmas áreas neurais de quando vivenciamos a situação na vida real. Por isso, enredos puramente físicos (cheios de explosões e eventos sem impacto psicológico) falham em prender a atenção: a mente humana busca compreender como superar medos, contradições e traumas internos."
    },
    {
        title: "2. O Terceiro Trilho (The Third Rail)",
        content: "O Terceiro Trilho é a corrente de voltagem emocional que atravessa absolutamente todas as páginas da história. Enquanto os trilhos da esquerda e da direita representam os acontecimentos físicos da trama (o que acontece) e a mecânica das cenas, o terceiro trilho representa o significado interno (como isso afeta o protagonista). Se um evento não altera a percepção do personagem sobre si mesmo ou sobre seu mundo, a cena torna-se o que chamamos de 'ação física vazia'."
    },
    {
        title: "3. Falsa Crença (Misbelief)",
        content: "A Falsa Crença é a visão de mundo distorcida e equivocada que o protagonista adota no passado para se proteger de uma dor emocional ou trauma. Toda a jornada do romance consiste em desmantelar essa proteção defensiva. A história não é sobre o obstáculo externo em si, mas sobre forçar o protagonista a encarar e destruir sua Falsa Crença para conseguir vencer a batalha final."
    },
    {
        title: "4. A Cena de Origem (Origin Scene)",
        content: "Nenhum personagem nasce no primeiro capítulo. A Cena de Origem é o momento específico no passado do protagonista em que sua expectativa ingênua sobre o mundo colidiu com uma decepção dolorosa, fazendo-o adotar a Falsa Crença como uma tática de sobrevivência. Mesmo que essa cena não apareça explicitamente no livro, escrevê-la é crucial para ancorar a lógica interna do personagem."
    },
    {
        title: "5. Causalidade Rígida (Cause & Effect)",
        content: "A estrutura de uma história precisa substituir o elo 'e então' (episódico) pelo elo 'e por isso' (causal). Cada cena deve ser a consequência direta e inescapável da decisão tomada pelo protagonista na cena anterior. Se a ordem de duas cenas puder ser trocada sem afetar a lógica da narrativa, o encadeamento causal está quebrado."
    },
    {
        title: "6. O Clímax e a Virada Interna",
        content: "O Clímax é o ápice do romance onde a batalha externa e a batalha interna colidem. O protagonista só consegue resolver o conflito físico e derrotar o antagonista após renunciar à sua Falsa Crença e abraçar a Verdade. A vitória exige um sacrifício pessoal genuíno."
    }
];

// ==========================================
// 2. TEMPLATE SG (FICHA ESTRUTURADA DE PLANEJAMENTO)
// ==========================================
const STORY_GENIUS_TEMPLATE = [
    {
        section: "A) Ficha de Identidade Emocional",
        fields: [
            { label: "Quem é o Protagonista?", hint: "Nome, papel social e estado inicial antes da história começar." },
            { label: "Qual é a Falsa Crença (Misbelief)?", hint: "A tese equivocada sobre a vida que o impede de ser pleno." },
            { label: "Qual é a Cena de Origem (Origin Scene)?", hint: "O evento do passado em que a Falsa Crença foi moldada." },
            { label: "Qual é a Verdade (Truth)?", hint: "A lição que ele precisa aprender para se transformar no clímax." }
        ]
    },
    {
        section: "B) O Motor do Enredo (Conflito Dual)",
        fields: [
            { label: "Desejo Superficial (O que ele quer):", hint: "Meta externa física, tangível e mensurável." },
            { label: "Necessidade Interna (O que ele precisa):", hint: "Mudança psicológica indispensável para sua cura emocional." },
            { label: "O Que Está em Jogo (Apostas/Stakes):", hint: "O que de terrível acontece se ele falhar na missão?" }
        ]
    },
    {
        section: "C) Estrutura do Cartão de Cena SG",
        fields: [
            { label: "1. Ponto Alfa (Ação Física):", hint: "O que acontece concretamente na cena." },
            { label: "2. Terceiro Trilho (Significado Emocional):", hint: "Como isso afeta e pressiona a Falsa Crença do personagem?" },
            { label: "3. Mudança de Percepção (Virada):", hint: "A realização ou conclusão interna que o personagem atinge." },
            { label: "4. E Por Isso... (Desfecho Causal):", hint: "A decisão que deflagra diretamente a próxima cena." }
        ]
    }
];

// ==========================================
// 3. PLANEJAMENTO SG (GUIA PASSO A PASSO EM 5 FASES)
// ==========================================
const STORY_GENIUS_PLANNING = [
    {
        phase: "FASE 1: A Escavação do Protagonista",
        step: "Passo 1 ao 3",
        description: "Defina o dilema central do protagonista. Escave o passado para escrever a Cena de Origem e identifique a Falsa Crença que o impede de alcançar a felicidade real."
    },
    {
        phase: "FASE 2: Estabelecendo o Terceiro Trilho",
        step: "Passo 4 ao 6",
        description: "Mapeie a necessidade interna vs. o desejo superficial. Defina as apostas emocionais e garanta que cada conflito futuro pressione a vulnerabilidade do herói."
    },
    {
        phase: "FASE 3: O Ponto de Partida e o Destino",
        step: "Passo 7 ao 9",
        description: "Escreva o Primeiro Capítulo mostrando o mundo comum sob as lentes distorcidas da Falsa Crença. Em seguida, imagine o Clímax onde essa crença será testada ao limite."
    },
    {
        phase: "FASE 4: O Mapeamento da Causalidade",
        step: "Passo 10 ao 12",
        description: "Construa a sequência de cartões de cena. Utilize sempre a fórmula 'Ação Física -> Reação Psicológica -> Decisão -> E por isso...' para encadear os capítulos."
    },
    {
        phase: "FASE 5: Redação e Revisão do Rascunho",
        step: "Passo 13 ao 15",
        description: "Redija o manuscrito mantendo a voltagem do Terceiro Trilho ativa. Na revisão, elimine cenas onde o protagonista seja um mero observador passivo."
    }
];

// ==========================================
// 4. LÍNGUA PORTUGUESA PARA ROMANCISTAS
// ==========================================
const PORTUGUESE_THEORY = [
    {
        title: "História da Língua Portuguesa",
        content: "A língua portuguesa é românica e surgiu da transformação do latim falado no noroeste da Península Ibérica, em contato com línguas anteriores à romanização e, mais tarde, com influências germânicas e árabes. Na Idade Média, galego e português formavam o galego-português, usado em documentos e na poesia trovadoresca. A separação entre os dois idiomas avançou gradualmente, enquanto o português se consolidava no território do reino de Portugal. A expansão marítima levou-o à América, à África e à Ásia, onde surgiram novas variedades. Entre romancistas de grande projeção que escrevem em português estão Machado de Assis, José Saramago, vencedor do Nobel de 1998, e Mia Couto, laureado com o Prêmio Camões de 2013."
    },
    {
        title: "1. Fonética e Fonologia",
        content: "A fonética descreve como os sons são produzidos, transmitidos e percebidos; a fonologia estuda o papel desses sons no sistema de uma língua. Para um romancista, essa diferença ajuda a construir vozes reconhecíveis. Um personagem pode ter determinado ritmo, nasalidade, pronúncia do 'r' ou tendência a reduzir sílabas, mas essas marcas devem aparecer com moderação para não virar caricatura. A fonologia também inspira nomes, aliterações e contrastes sonoros: sons duros podem acompanhar uma cena agressiva, enquanto repetições sibilantes podem sugerir segredo."
    },
    {
        title: "2. Prosódia",
        content: "A prosódia reúne aspectos como ritmo, duração, intensidade, acento e entonação. Na literatura, ela permite sugerir como uma fala soaria, mesmo quando o leitor não a escuta. Frases curtas podem acompanhar medo, pressa ou violência; períodos longos podem reproduzir reflexão, cansaço ou divagação. Uma resposta que termina em suspensão pode transmitir dúvida, enquanto uma queda brusca de ritmo pode indicar encerramento ou autoridade. O escritor deve combinar pontuação, extensão das frases, interrupções e verbos de elocução, sem depender exclusivamente de expressões como 'disse nervosamente'."
    },
    {
        title: "3. Ortografia",
        content: "Ortografia é o sistema de convenções que organiza a representação escrita da língua. Em um romance, ela pode diferenciar cartas, mensagens, documentos oficiais e anotações pessoais. Abreviações, grafias antigas ou ausência de acentos podem indicar época, pressa, intimidade ou escolaridade, mas o excesso dificulta a leitura e reduz personagens a estereótipos. Em narrativas históricas, consultar a ortografia do período evita anacronismos; em textos contemporâneos, a norma padrão costuma funcionar melhor na voz do narrador."
    },
    {
        title: "4. Pontuação",
        content: "A pontuação organiza relações sintáticas, orienta o ritmo e interfere na interpretação. Em romances, o ponto pode acelerar uma perseguição, a vírgula pode prolongar uma reflexão e o travessão pode marcar interrupção ou confronto. Os dois-pontos preparam uma revelação; a interrogação deixa uma resposta pendente; as reticências podem indicar hesitação ou suspensão. Esses sinais não representam simplesmente pausas respiratórias, pois também estruturam o sentido escrito."
    },
    {
        title: "5. Morfologia",
        content: "A morfologia estuda a estrutura das palavras, seus morfemas e processos de formação, como flexão, derivação e composição. Na criação de romances, ela ajuda a inventar nomes, profissões, instituições e gírias plausíveis. Um mundo fictício ganha consistência quando seus neologismos seguem padrões reconhecíveis. As flexões também caracterizam vozes: escolhas de pessoa, tempo e modo verbal podem revelar distância, certeza, ironia ou pertencimento. A voz ativa destaca quem age; a passiva pode esconder o agente; a reflexiva apresenta uma ação voltada ao próprio sujeito."
    },
    {
        title: "6. Sintaxe",
        content: "A sintaxe analisa como as palavras se combinam e que funções exercem nas frases. Para o romance, ela cria voz narrativa e controla o foco. Períodos longos podem acompanhar uma consciência reflexiva ou presa às lembranças; frases breves podem transmitir urgência. A ordem dos termos também altera a saliência: começar pela carta, e não por quem a esconde, faz do objeto o centro da cena. No diálogo, elipses, perguntas e interrupções sugerem relações de poder ou dificuldade emocional."
    },
    {
        title: "7. Semântica",
        content: "A semântica estuda os significados das palavras e dos enunciados, além das relações entre eles. Para um romancista, ela oferece recursos para símbolos, ambiguidades, metáforas e mudanças de sentido. Uma palavra recorrente pode acompanhar a transformação de uma personagem: 'casa' pode significar proteção no início e aprisionamento no final. A polissemia permite diálogos em que uma expressão é entendida de maneiras diferentes por duas pessoas. O escritor também pode criar campos semânticos para sustentar um tema."
    },
    {
        title: "8. Pragmática",
        content: "A pragmática estuda como o contexto participa do sentido e como a fala realiza ações. Em romances, ela é essencial para escrever subtexto. 'Você pode fechar a janela?' costuma funcionar como pedido, não como pergunta sobre capacidade. Uma personagem pode elogiar para ironizar, responder parcialmente para esconder algo ou mudar de assunto para evitar uma acusação. Defina o que cada interlocutor quer, sabe e oculta."
    },
    {
        title: "9. Gramática",
        content: "Gramática pode significar o estudo da organização da língua ou o conjunto de normas de determinado uso. Ao escrever romances, é importante conhecer a norma padrão sem tratá-la como a única expressão legítima. A narração pode adotar registro monitorado, enquanto os diálogos variam conforme idade, região, profissão e intimidade. Repetições, frases interrompidas e concordâncias não padrão podem ser escolhas expressivas, se forem coerentes."
    },
    {
        title: "10. Lexicologia",
        content: "A lexicologia investiga o léxico, incluindo formação, origem, sentidos, empréstimos e neologismos. No romance, o vocabulário ajuda a construir comunidades e trajetórias. Uma médica, um pescador e um adolescente não nomeiam necessariamente o mundo do mesmo modo. Regionalismos e termos profissionais podem indicar pertencimento, enquanto palavras de outro país podem revelar mudança de identidade."
    },
    {
        title: "11. Lexicografia",
        content: "A lexicografia dedica-se à elaboração e análise de dicionários, glossários e vocabulários. Para o romancista, dicionários gerais, históricos, regionais e de regência são instrumentos de pesquisa. Um verbete pode informar significado, classe gramatical, pronúncia, origem, flexão e marca regional. O escritor também pode transformar o verbete em recurso narrativo: um diário pode registrar definições pessoais, ou uma investigação depender de uma palavra ambígua."
    },
    {
        title: "12. Estilística",
        content: "A estilística analisa como escolhas de linguagem produzem expressividade. Em romances, ajuda a transformar recursos formais em assinatura de voz. Repetições podem sugerir obsessão; frases longas podem acompanhar devaneio; imagens sensoriais podem revelar a percepção de uma personagem. Uma narrativa sobre luto pode retomar palavras ligadas a ausência e silêncio. Figuras como metáfora, ironia e antítese devem cumprir funções narrativas."
    },
    {
        title: "13. Análise do Discurso",
        content: "A análise do discurso observa como a linguagem produz sentidos em contextos históricos, sociais e políticos. Ela ajuda o romancista a mostrar relações de poder sem explicá-las didaticamente. Uma instituição pode chamar vigilância de proteção, ou uma família denominar violência como cuidado. Ao criar discursos de governo, imprensa, religião ou empresa, pergunte quem nomeia os fatos e quem é silenciado."
    },
    {
        title: "14. Sociolinguística",
        content: "A sociolinguística estuda a relação entre língua e sociedade, observando variação regional, social, histórica e situacional. Na criação de personagens, ela impede que um único padrão represente todos os falantes. Região, idade, profissão e relação entre interlocutores influenciam pronomes, vocabulário, pronúncia e ritmo. Variedade não significa incapacidade; personagens complexos podem dominar registros diferentes e usá-los estrategicamente."
    },
    {
        title: "15. Psicolinguística",
        content: "A psicolinguística investiga os processos mentais envolvidos na aquisição, compreensão e produção da linguagem. Para o romancista, ela oferece referências para representar pensamentos, memória e falhas de comunicação com mais precisão. Sob estresse, uma personagem pode repetir palavras, perder o fio da frase ou interpretar uma fala de maneira equivocada."
    },
    {
        title: "16. Filologia",
        content: "A filologia estuda textos do passado, sua língua, transmissão, contexto e versões. A crítica textual compara manuscritos e edições para avaliar variantes. Esses procedimentos podem inspirar romances sobre cartas, arquivos, diários e documentos de família. Uma diferença entre duas cópias pode alterar uma herança, ocultar um nome ou modificar uma promessa."
    },
    {
        title: "17. Estudos Textuais",
        content: "Os estudos textuais analisam como um texto se organiza e produz sentido. Para o romance, ajudam a controlar coesão, coerência, gêneros e arquitetura. Pronomes, conectores, repetições e tempos verbais ligam cenas; a coerência depende da continuidade de objetivos, causas, consequências e regras do mundo ficcional."
    },
    {
        title: "18. Redação",
        content: "Redação é o ato de produzir um texto e, no trabalho literário, envolve planejamento, escrita, revisão e reescrita. Antes da primeira versão, o romancista pode definir protagonista, desejo, obstáculo, ponto de vista, cenário e função de cada capítulo. A revisão começa pelo conjunto: arco das personagens, causalidade, ritmo e tensão. A reescrita pode cortar cenas, deslocar informações ou aprofundar conflitos."
    },
    {
        title: "19. Literatura",
        content: "Literatura é uma forma de arte que organiza a linguagem para produzir experiências estéticas, narrativas e reflexivas. Para escrever romances, o autor pode estudar como diferentes obras usam narradores, gêneros, tempo, focalização, personagens e estrutura. A escolha final deve unir forma e conteúdo, fazendo o modo de narrar participar do tema e da transformação das personagens."
    }
];

// ==========================================
// 5. BANCO DAS 200 DICAS DE PRODUÇÃO
// ==========================================
const NOVEL_TIPS = [
    "Foque na transformação psicológica interna do protagonista, pois histórias são simulações cognitivas para processar dilemas emocionais reais da vida humana.",
    "O enredo externo existe unicamente como um catalisador planejado para desmontar a falsa visão de mundo do seu protagonista.",
    "Leitores não se conectam a eventos físicos isolados, mas à forma como o personagem sente, interpreta e reage a eles.",
    "A mente humana busca na ficção estratégias de sobrevivência emocional; sem dilema interno, a ação se torna rasa e irrelevante.",
    "O motor secreto de qualquer romance marcante é o arco psicológico do personagem, não a sequência de explosões ou reviravoltas.",
    "Evite escrever sem rumo; entenda a psicologia do personagem antes de traçar o primeiro evento físico do seu enredo.",
    "Pergunte constantemente 'E daí?'; cada acontecimento da trama precisa ter um significado profundo e pessoal para o protagonista.",
    "A empatia do leitor surge quando ele enxerga as vulnerabilidades e os pontos cegos emocionais da figura central.",
    "Histórias universais nascem de verdades psicológicas específicas; quanto mais específica a dor do personagem, maior a conexão humana.",
    "O enredo é o teste do ácido; ele deve ser desenhado sob medida para esmagar as defesas emocionais do personagem.",
    "A falsa crença é a tese distorcida sobre o mundo que o protagonista adota para se proteger de traumas passados.",
    "Identifique o medo central do personagem, pois é dele que nasce a falsa crença que bloqueia sua felicidade real.",
    "O arco narrativo completo consiste em forçar o protagonista a abandonar sua falsa crença para abraçar a verdade interna.",
    "A falsa crença deve parecer perfeitamente lógica para o protagonista, tornando sua resistência à mudança dolorosa e crível.",
    "Cada decisão equivocada do protagonista no enredo deve ser uma tentativa desesperada de proteger sua própria falsa crença.",
    "Dê ao personagem uma armadura emocional rígida; a história será o martelo que quebrará essa proteção passo a passo.",
    "A verdadeira batalha da história ocorre dentro da mente do herói, entre a falsa crença e a necessidade de transformação.",
    "Sem uma falsa crença clara, o protagonista não tem o que aprender e o enredo perde seu propósito emocional.",
    "A falsa crença não é um defeito superficial, mas uma estratégia de sobrevivência que falhou ao longo do tempo.",
    "Confronte a falsa crença em todas as cenas; nunca dê trégua às ilusões defensivas do seu protagonista.",
    "Escreva a cena de origem onde a falsa crença nasceu de uma dor ou decepção na infância do personagem.",
    "A cena de origem revela o momento exato em que uma expectativa saudável do personagem foi destruída pela realidade.",
    "Redija a cena de origem em primeira pessoa para sentir a carga emocional que moldou a psique do protagonista.",
    "Mesmo que a cena de origem não entre no livro, ela é o pilar que sustenta toda a lógica do enredo.",
    "Crie três cenas de encruzilhada no passado onde o personagem tomou decisões erradas guiado pela falsa crença.",
    "Ninguém entra na história como folha em branco; o passado dramatizado justifica o comportamento defensivo do presente.",
    "As cenas de encruzilhada mostram o enrijecimento gradual das defesas psicológicas do protagonista ao longo dos anos.",
    "Use a backstory para garantir que cada atitude do personagem no primeiro capítulo tenha uma justificativa histórica sólida.",
    "A dor do passado é o combustível da história presente; escave a memória do personagem antes de começar.",
    "O passado do protagonista dita a forma como ele interpreta erroneamente os fatos do presente no romance.",
    "Separe claramente o objetivo superficial externo do personagem da sua necessidade interna profunda de transformação emocional.",
    "O objetivo superficial é o que o personagem quer; a necessidade interna é o que ele precisa para se curar.",
    "No início da história, o protagonista acredita falsamente que alcançar sua meta superficial resolverá todos os seus problemas.",
    "O conflito humano surge porque o desejo superficial e a necessidade interna entram em rota de colisão inevitável.",
    "Torne o objetivo superficial extremamente concreto e específico, evitando metas vagas ou abstratas para o enredo.",
    "O desejo superficial cria a ação visível do enredo, enquanto a necessidade interna cria o significado emocional da obra.",
    "Ao perseguir a meta externa, o protagonista deve colidir continuamente com as limitações impostas pela sua falsa crença.",
    "A verdadeira vitória do herói ocorre quando ele renuncia ao objetivo egoísta em prol de sua necessidade interna.",
    "Pergunte por que o personagem quer aquela meta superficial; a resposta revelará a carência emocional subjacente.",
    "Mantenha a meta externa clara para que o leitor saiba exatamente o que está em jogo fisicamente a cada momento.",
    "O terceiro trilho é a voltagem emocional interna que precisa atravessar absolutamente todas as cenas da história.",
    "Uma cena sem terceiro trilho é apenas ação física vazia; descarte eventos que não alterem o estado emocional.",
    "Pergunte em cada cena: 'Por que isso importa pessoalmente para o protagonista e como afeta sua falsa crença?'",
    "Conecte cada evento externo a uma tomada de consciência psicológica imediata na mente da figura central.",
    "O terceiro trilho garante que a ação física e o significado psicológico caminharem juntos em cada página escrita.",
    "Se o evento não provocar um dilema ou uma reavaliação interna no protagonista, a cena perderá o interesse do leitor.",
    "A voltagem do terceiro trilho deve aumentar a cada capítulo, elevando a pressão sobre as defesas do personagem.",
    "Mostre o processamento interno do personagem entre o estímulo externo e a decisão que ele toma em seguida.",
    "O leitor lê nas entrelinhas; o terceiro trilho dá sentido e profundidade subtextual aos diálogos e ações.",
    "Mantenha o terceiro trilho ativo mesmo nas cenas de ritmo acelerado para não perder o foco na transformação.",
    "Substitua a lógica fraca do 'e então' pela dinâmica rigorosa do 'e por isso' ao encadear suas cenas.",
    "Toda cena deve ser a consequência direta da decisão tomada pelo protagonista no final da cena anterior.",
    "Elimine coincidências convenientes; faça com que os problemas nasçam das próprias escolhas equivocadas do personagem.",
    "A causalidade ininterrupta impede que a história pareça uma colagem desconexa de episódios sem relação entre si.",
    "Submeta cada ponto do enredo ao teste da lógica: por que isso acontece e qual reação imediata provoca?",
    "Se você pode trocar a ordem de duas cenas sem alterar a história, a cadeia causal está quebrada.",
    "O efeito de uma cena deve se tornar a causa imediata do conflito da cena que vem a seguir.",
    "Crie uma reação em cadeia onde cada tentativa de consertar o problema gera uma complicação ainda maior.",
    "Causalidade estrita cria o sentimento inevitável de que o destino do protagonista está sendo selado por ele mesmo.",
    "Teste a viabilidade logística de cada evento externo antes de usá-lo para pressionar a psicologia do personagem.",
    "Planeje cada cena definindo o Ponto Alfa, a função narrativa indispensável que ela cumpre na obra.",
    "Mapeie a causa física no topo do cartão de cena e o efeito prático imediato que ela produz no mundo.",
    "Registre a realização psicológica do protagonista no cartão de cena antes de redigir o texto definitivo.",
    "Finalize o cartão de cena com a pergunta 'E por isso?', estabelecendo a ação concreta que deflagra a próxima cena.",
    "O cartão de cena evita o bloqueio criativo, garantindo que você saiba para onde a escrita está caminhando.",
    "Diagnosticando cenas fracas com o cartão de cena, você elimina trechos inúteis antes mesmo de escrever o rascunho.",
    "Use o cartão de cena para equilibrar o avanço do enredo externo com o amadurecimento psicológico interno.",
    "Cada cartão de cena deve conter um dilema real que obrigue o personagem a fazer uma escolha difícil.",
    "Não confunda cartão de cena com resumo de enredo; o foco deve estar na mudança de percepção interna.",
    "Um bom cartão de cena mostra como o mundo externo e o mundo interno colidem em um ponto crítico.",
    "Crie um problema externo grande o bastante para sustentar todo o romance do início ao fim sem enrolação.",
    "Estabeleça um prazo limite claro e um relógio regressivo para injetar urgência e tensão constante na trama.",
    "Aumente as apostas revelando as consequências terríveis e inevitáveis caso o protagonista falhe na sua missão.",
    "Torne os obstáculos cada vez mais difíceis, exigindo sacrifícios pessoais crescentes do personagem a cada etapa.",
    "O problema externo deve forçar o protagonista a agir exatamente onde ele se sente mais inseguro e desarmado.",
    "Force o personagem a fazer escolhas entre duas opções igualmente dolorosas para revelar seu verdadeiro caráter.",
    "Não proteja seu protagonista; coloque-o em situações onde suas antigas estratégias de defesa falhem miseravelmente.",
    "O problema do enredo deve ser personalizado para expor e desmantelar a falsa crença específica daquele personagem.",
    "Mantenha as consequências da falha sempre visíveis no horizonte para que o leitor nunca perca o medo do fracasso.",
    "O prazo limite impede que o personagem adie decisões difíceis, acelerando a narrativa em direção ao clímax.",
    "Subtramas não são distrações; elas devem espelhar, desafiar ou intensificar o dilema central do protagonista.",
    "Cada personagem secundário deve representar uma visão de mundo diferente que confronta a falsa crença do herói.",
    "Evite personagens funcionais sem vida; dê a todos motivações próprias e opiniões sobre o conflito principal.",
    "O antagonista não é apenas mau; ele é a encarnação perfeita das forças que testam a Falsa Crença do protagonista.",
    "Use aliados para apontar os pontos cegos do protagonista, mesmo quando ele se recusa a ouvir a verdade.",
    "Converta subtramas em pressões adicionais que reduzem o espaço de manobra do personagem no enredo principal.",
    "Relações amorosas na ficção devem funcionar como espelhos emocionais que exigem vulnerabilidade e entrega real.",
    "Elimine personagens secundários que não afetam as escolhas do protagonista ou não avançam a cadeia causal.",
    "A jornada do herói transforma também os personagens ao seu redor, reagindo à sua mudança de atitude.",
    "Alinhe todas as linhas secundárias para que convirjam juntas em direção ao momento decisivo do clímax.",
    "O clímax é o momento de revelação onde o protagonista finalmente enxerga e destrói sua falsa crença central.",
    "A vitória no enredo externo só é possível após a rendição emocional do personagem à verdade interna.",
    "No clímax, a nova visão de mundo do herói deve ser testada através de um sacrifício pessoal supremo.",
    "Saiba como o romance termina antes de redigir o primeiro capítulo para manter o foco na transformação.",
    "Escreva o rascunho permitindo que o leitor habite a mente do protagonista e sinta seu processamento interno.",
    "Não descreva apenas o cenário; mostre o cenário através do filtro emocional e preconceitos do personagem.",
    "Na revisão, corte cenas que não possuem terceiro trilho ou que não alteram a trajetória de causa e efeito.",
    "Verifique se o momento de vitória no clímax foi plenamente merecido através de dores e aprendizados reais.",
    "O final do romance deve mostrar a nova realidade do personagem, contrastando com seu estado inicial engessado.",
    "Confie na neurociência da narrativa: mantenha o foco no arco interno e seu livro conquistará o leitor.",
    "Defina uma voz narrative coerente antes de começar; ela orientará vocabulário, ritmo, sintaxe e distância emocional ao longo do romance.",
    "Diferencie personagens pela maneira de construir frases, não apenas por bordões ou gírias repetidas.",
    "Leia diálogos em voz alta para perceber pausas artificiais, ritmos iguais e falas que não soam naturais.",
    "Use sotaques com moderação; poucas marcas bem escolhidas são mais eficazes que uma transcrição fonética cansativa.",
    "Evite representar variedades linguísticas como sinais de inferioridade, ignorância ou mau caráter.",
    "Crie uma ficha de voz para cada personagem, registrando ritmo, vocabulário, pronomes e construções preferidas.",
    "Use frases curtas para transmitir urgência, medo, choque ou aceleração durante uma cena.",
    "Reserve períodos longos para reflexão, descrição detalhada, memória ou pensamento labiríntico.",
    "Varie o comprimento das frases para evitar uma prosa monótona e controlar o ritmo da leitura.",
    "Use a pontuação para orientar a velocidade, não apenas para corrigir pausas gramaticais.",
    "Coloque uma informação decisiva em frase isolada quando quiser aumentar seu impacto narrativo.",
    "Use dois-pontos para preparar uma revelação, explicação ou consequência importante.",
    "Empregue o ponto e vírgula para aproximar ideias relacionadas sem fundi-las completamente.",
    "Reserve as reticências para hesitação, interrupção ou suspensão; o excesso enfraquece seu efeito.",
    "Use o travessão para marcar interrupções, mudanças bruscas ou comentários destacados.",
    "Não separe sujeito e predicado por vírgula sem uma razão sintática ou expressiva clara.",
    "Use perguntas sem resposta imediata para criar expectativa e prolongar a tensão narrativa.",
    "Faça a pontuação refletir o estado emocional, mas não substitua ações, gestos e descrições concretas.",
    "Use interrogações sucessivas apenas quando a intensidade da cena realmente exigir esse recurso.",
    "Revise a pontuação observando se ela altera involuntariamente o sentido de uma frase.",
    "Escolha o tempo verbal conforme a distância desejada entre narrador e acontecimento.",
    "Use o pretérito imperfeito para ações habituais, durativas ou inacabadas no passado.",
    "Use o pretérito perfeito para acontecimentos concluídos e relevantes para o avanço da trama.",
    "Empregue o futuro do pretérito para hipóteses, possibilidades, desejos ou informações condicionais.",
    "Observe a concordância verbal mesmo quando a fala coloquial da personagem apresentar desvios deliberados.",
    "Use a voz passiva para destacar quem sofre uma ação ou ocultar temporariamente seu agente.",
    "Prefira a voz ativa quando quiser tornar a ação mais direta e destacar o responsável por ela.",
    "Use verbos precisos no lugar de advérbios excessivos que apenas expliquem emoções já evidentes.",
    "Troque verbos genéricos por verbos específicos quando a ação precisar ganhar clareza ou força.",
    "Evite acumular adjetivos; escolha detalhes capazes de revelar aparência, atmosfera e personalidade simultaneamente.",
    "Use diminutivos para expressar tamanho, carinho, ironia, intimidade ou desprezo conforme o contexto.",
    "Observe como prefixos e sufixos alteram o sentido de palavras e podem formar neologismos plausíveis.",
    "Crie palavras inventadas seguindo padrões morfológicos reconhecíveis do português.",
    "Verifique se um neologismo parece pertencer ao período histórico e ao grupo social representado.",
    "Use nomes próprios coerentes com época, região, religião e origem social das personagens.",
    "Escolha pronomes de tratamento de acordo com hierarquia, intimidade e contexto histórico.",
    "Use 'tu', 'você' ou outras formas pronominais para revelar relações regionais e sociais, não aleatoriamente.",
    "Controle a colocação pronominal conforme o registro da cena e a voz de quem fala.",
    "Use a ordem dos termos para destacar objetos, ações ou personagens importantes na percepção narrativa.",
    "Comece a frase pelo elemento que deseja colocar em primeiro plano na consciência do leitor.",
    "Use orações subordinadas para representar relações de causa, condição, tempo ou consequência entre acontecimentos.",
    "Prefira coordenação e frases enxutas em cenas de ação rápida ou conflito físico.",
    "Use frases nominais em momentos de choque, fragmentação mental ou observação instantânea.",
    "Evite repetir a mesma estrutura sintática em parágrafos consecutivos sem intenção estilística.",
    "Use paralelismo para reforçar contrastes, listas, promessas ou transformações de uma personagem.",
    "Construa o subtexto deixando a intenção real diferente do significado literal da fala.",
    "Defina o que cada personagem sabe antes de escrever um diálogo com omissões ou indiretas.",
    "Use respostas evasivas para mostrar medo, culpa, manipulação ou desejo de esconder informação.",
    "Faça silêncios comunicarem algo específico: recusa, surpresa, luto, ameaça ou constrangimento.",
    "Revise pronomes como 'ele', 'ela' e 'isso' para evitar referentes ambíguos.",
    "Use palavras recorrentes para criar motivos temáticos, mas altere seu sentido conforme a história avança.",
    "Escolha metáforas coerentes com a experiência, profissão e imaginação da personagem que as emprega.",
    "Evite metáforas incompatíveis com o ponto de vista ou com o conhecimento da personagem.",
    "Use polissemia para permitir que uma palavra adquira sentidos diferentes em momentos decisivos.",
    "Diferencie ironia verbal de afirmação literal por meio do contexto, das reações e do contraste entre fala e ação.",
    "Crie campos semânticos discretos para associar personagens a cores, objetos, sons ou elementos naturais.",
    "Revise ambiguidades acidentais que possam fazer o leitor interpretar a ação de maneira errada.",
    "Preserve ambiguidades intencionais quando elas contribuírem para suspense, conflito ou múltiplas interpretações.",
    "Use palavras concretas para ancorar emoções abstratas em objetos, gestos e sensações observáveis.",
    "Substitua explicações emocionais por sinais físicos quando a cena puder demonstrar o sentimento.",
    "Pesquise o vocabulário histórico antes de ambientar um romance em outra época.",
    "Consulte dicionários regionais ao representar falares específicos, verificando se os termos são realmente usados.",
    "Evite inserir gírias atuais em narrativas históricas sem justificar sua presença.",
    "Use vocabulário profissional para indicar conhecimento, rotina e pertencimento ocupacional.",
    "Explique termos técnicos pelo contexto, evitando interromper a cena com definições enciclopédicas.",
    "Permita que o repertório lexical de uma personagem mude quando sua identidade ou posição social se transforma.",
    "Use empréstimos linguísticos somente quando forem coerentes com contatos culturais presentes no enredo.",
    "Verifique a origem de palavras antes de atribuí-las a personagens de outra época ou comunidade.",
    "Use arcaísmos seletivamente; poucos termos situam melhor o período que uma fala inteiramente artificial.",
    "Consulte exemplos de uso, não apenas definições, antes de escolher uma palavra incomum.",
    "Use dicionários de regência para conferir preposições exigidas por verbos e nomes.",
    "Confira se a palavra escolhida pertence à classe gramatical adequada à frase.",
    "Pesquise sinônimos observando diferenças de registro, intensidade, região e conotação.",
    "Não trate sinônimos como perfeitamente intercambiáveis; cada escolha pode alterar o tom da cena.",
    "Use o dicionário para descobrir sentidos esquecidos, mas confirme se combinam com o contexto narrativo.",
    "Revise a coesão verificando pronomes, conectores, repetições e retomadas entre frases.",
    "Garanta que cada capítulo avance uma ação, uma informação, uma relação ou uma transformação significativa.",
    "Use conectores temporais para orientar mudanças de cena, passagem de horas e saltos cronológicos.",
    "Marque mudanças de focalização para que o leitor saiba cuja percepção está organizando a cena.",
    "Limite a informação ao que o narrador ou a personagem poderia saber naquele momento.",
    "Use documentos, cartas e mensagens para variar gêneros textuais dentro do romance.",
    "Diferencie cada documento por finalidade, destinatário, grau de formalidade e relação com os acontecimentos.",
    "Revise a coerência temporal para evitar que uma personagem saiba fatos ainda não descobertos.",
    "Use repetições de objetos ou frases para conectar capítulos distantes e produzir continuidade temática.",
    "Corte frases que apenas repetem informações já demonstradas por ações ou diálogos.",
    "Planeje o vocabulário central de cada núcleo narrativo antes de escrever suas cenas.",
    "Revise primeiro a estrutura do romance; corrija estilo e pontuação depois de resolver problemas de enredo.",
    "Faça uma leitura exclusiva para detectar palavras repetidas em excesso próximas umas das outras.",
    "Faça outra leitura procurando verbos vagos, como 'fazer', 'ter', 'dar' e 'pôr', que podem ser substituídos.",
    "Verifique se cada descrição contém detalhes relevantes para atmosfera, personagem ou conflito.",
    "Corte comparações que não acrescentem imagem, informação, humor ou interpretação à cena.",
    "Use a primeira pessoa para limitar informação e aproximar o leitor da experiência subjetiva.",
    "Use a terceira pessoa limitada para manter proximidade sem prender toda a narração ao 'eu'.",
    "Escolha o narrador considerando quanto suspense, intimidade e confiabilidade a história precisa.",
    "Não misture vozes narrativas no mesmo parágrafo sem sinalizar claramente a mudança.",
    "Use discurso indireto livre para aproximar a narração dos pensamentos sem introduzir cada frase com 'pensou'.",
    "Diferencie pensamento, fala e narração por contexto, pontuação e escolha de registro.",
    "Revise cada diálogo perguntando se ele produz ação, revela caráter ou transforma uma relação.",
    "Elimine saudações, explicações e informações que os personagens já conhecem quando servirem apenas ao leitor.",
    "Leia o romance como leitor: marque trechos confusos, previsíveis ou artificiais e reescreva-os com objetivo definido."
];
