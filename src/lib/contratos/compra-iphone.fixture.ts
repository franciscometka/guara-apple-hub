import { MODELO_COMPRA } from "./campos/compra-iphone";
import type { DadosContrato } from "./campos/tipos";

/** Somente para testes; nunca usado para pré-preencher contratos reais. */
export function dadosCompraFicticia(parcelado = false): DadosContrato {
  const dados: DadosContrato = {};
  for (const passo of MODELO_COMPRA.etapas[0]?.passos ?? []) {
    for (const campo of passo.campos) {
      dados[campo.nome] = campo.naoSeAplica?.texto ?? (
        campo.tipo === "dinheiro" ? 5000 :
        campo.tipo === "cpf" ? "529.982.247-25" :
        campo.tipo === "imei" ? "490154203237518" :
        campo.tipo === "data" ? "2026-10-08" :
        campo.tipo === "hora" ? "15:30" :
        campo.tipo === "telefone" ? "(42) 99999-0000" :
        campo.tipo === "uf" ? "PR" :
        campo.tipo === "numero" ? "10" :
        campo.tipo === "opcoes" ? (campo.opcoes?.[0]?.valor ?? "") : "Informado"
      );
    }
  }
  return { ...dados,
    loja_razao_social: "Loja Fictícia", loja_cnpj: "11.222.333/0001-81",
    loja_endereco_simples: "Rua Teste, 10", loja_cidade_uf: "Guarapuava/PR",
    loja_cep: "85010-000", loja_representante: "Ana Teste",
    consumidor_nome: "Cliente Fictício", consumidor_documento: "1234567",
    consumidor_endereco: "Rua Exemplo, 20, Guarapuava/PR",
    adquirido_modelo: "iPhone 18 Pro Max", adquirido_capacidade: "256 GB",
    adquirido_cor: "Preto", adquirido_condicao: "Novo",
    adquirido_estado_aparente: "Sem marcas", adquirido_serie: "TESTE2026",
    adquirido_conservacao: "Novo, cabo USB-C", adquirido_nota_fiscal: "12345",
    pagamento_meio: "Pix", pagamento_forma: "À vista",
    ha_parcelamento: parcelado ? "sim" : "não",
    transferencia_local: "Loja Fictícia", cidade: "Guarapuava",
    testemunha1_nome: "Maria Teste", testemunha2_nome: "Pedro Teste",
    anexo_saida_estado: "Sem marcas", anexo_saida_acessorios: "Cabo USB-C",
    parcelas_quantidade: "10", parcelas_valor: 500, parcelas_total: 5000,
    parcelas_vencimento: "Dia 10", parcelas_juros: "0%", parcelas_periodicidade: "mês",
    parcelas_encargos: "nenhum", parcelas_cet: "0%", parcelas_financiador: "não se aplica",
  };
}