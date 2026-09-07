import type { ImageMetadata } from 'astro';

import fotoOficina from '../assets/img/oficina/oficina-motor.jpg';
import fotoTrocaOleo from '../assets/img/oficina/troca-oleo.jpg';
import fotoCentragem from '../assets/img/oficina/centragem-roda.jpg';
import fotoManutencao from '../assets/img/oficina/manutencao-geral.jpg';
import fotoPneu from '../assets/img/oficina/pneu-roda.jpg';
import fotoCapaBanco from '../assets/img/oficina/capa-banco.jpg';

export const fotos = {
  oficina: fotoOficina,
  trocaOleo: fotoTrocaOleo,
  centragem: fotoCentragem,
  manutencao: fotoManutencao,
  pneu: fotoPneu,
  capaBanco: fotoCapaBanco,
};

export interface Servico {
  nome: string;
  resumo: string;
  /** Nome do ícone em src/components/Icone.astro */
  icone: string;
  img?: ImageMetadata;
  destaque?: boolean;
}

/** Serviços publicados na página OFICINA da loja. */
export const servicos: Servico[] = [
  {
    nome: 'Troca de óleo',
    resumo:
      'Cada modelo e cada quilometragem definem a quantidade e a especificação do óleo. A gente confere isso antes de abastecer o motor.',
    icone: 'oleo',
    img: fotoTrocaOleo,
    destaque: true,
  },
  {
    nome: 'Caixa de direção',
    resumo:
      'Guidão com folga, batida ou trepidação na frenagem são sinais de caixa gasta. Avaliamos e trocamos no mesmo dia.',
    icone: 'direcao',
    img: fotoOficina,
    destaque: true,
  },
  {
    nome: 'Centragem de roda',
    resumo:
      'Roda empenada come pneu, cansa a suspensão e tira a estabilidade. Centramos raio por raio na bancada.',
    icone: 'roda',
    img: fotoCentragem,
    destaque: true,
  },
  {
    nome: 'Carga de bateria',
    resumo:
      'A carga é necessária quando a bateria não atinge a quantidade recomendada de energia. Testamos antes de indicar a troca.',
    icone: 'bateria',
    img: fotoManutencao,
  },
  {
    nome: 'Frizzo de roda',
    resumo:
      'Acabamento e alinhamento do aro, feito na bancada com a roda desmontada.',
    icone: 'chave',
    img: fotoPneu,
  },
  {
    nome: 'Capa de banco',
    resumo:
      'Troca e reforma da capa do banco, com material resistente a sol e chuva.',
    icone: 'banco',
    img: fotoCapaBanco,
  },
];

/** Especialidades de mão de obra descritas pela oficina. */
export const especialidades = [
  { nome: 'Motor', icone: 'motor' },
  { nome: 'Embreagem', icone: 'embreagem' },
  { nome: 'Elétrica', icone: 'eletrica' },
  { nome: 'Suspensão', icone: 'suspensao' },
  { nome: 'Injeção eletrônica', icone: 'injecao' },
] as const;

/** Diferenciais que a loja comunica hoje. */
export const diferenciais = [
  {
    titulo: 'Mão de obra certificada',
    texto: 'Mecânicos com formação SENAC RS. Serviço explicado antes de ser feito.',
    icone: 'selo',
  },
  {
    titulo: 'Tele entrega e busca',
    texto: 'Levamos a peça até você ou buscamos sua moto na região.',
    icone: 'entrega',
  },
  {
    titulo: 'Loja completa',
    texto: 'Peça, acessório e oficina no mesmo lugar. Você não roda a cidade atrás de nada.',
    icone: 'loja',
  },
  {
    titulo: 'Todas as marcas',
    texto: 'Honda, Yamaha, Suzuki, Sundown e Dafra — originais e de reposição.',
    icone: 'marcas',
  },
] as const;

/** Avaliações reais publicadas no perfil da loja no Google. */
export const depoimentos = [
  {
    autor: 'Edson Belmonte',
    origem: 'Google · 5 estrelas',
    texto:
      'Melhor loja da capital, pessoal bacana, preço acessível, várias formas de pagamento facilitado. Mecânico bom, de confiança, sabe o que faz, te dá várias dicas. Gerente da loja super bacana. Super recomendo!',
  },
  {
    autor: 'Are',
    origem: 'Google · Local Guide · 5 estrelas',
    texto:
      'Atendimento excelente. Precisei comprar uma capa de chuva com certa urgência, o vendedor Cledson foi super atencioso no WhatsApp, me mostrando várias opções de capas, tamanhos e valores. Trouxe aqui no meu serviço com rapidez! Super indico.',
  },
] as const;

/** Como funciona o atendimento, do primeiro contato à entrega. */
export const etapas = [
  {
    n: '01',
    titulo: 'Chama no WhatsApp',
    texto: 'Diz o modelo da moto e o que está acontecendo. Respondemos no horário da loja.',
  },
  {
    n: '02',
    titulo: 'Orçamento sem enrolação',
    texto: 'Passamos o valor da peça e da mão de obra antes de qualquer serviço.',
  },
  {
    n: '03',
    titulo: 'Serviço na bancada',
    texto: 'Mecânico certificado executa e mostra o que foi trocado.',
  },
  {
    n: '04',
    titulo: 'Retirada ou tele entrega',
    texto: 'Você busca na loja na Av. Farrapos ou a gente leva até você.',
  },
] as const;
