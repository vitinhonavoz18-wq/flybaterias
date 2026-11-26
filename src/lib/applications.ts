import type { Product } from "@/config/catalog";
import type { VehicleQuery } from "@/lib/whatsapp";

/**
 * Ponto de integração para uma BASE DE APLICAÇÃO VALIDADA
 * (tabela oficial de qual bateria serve em cada veículo).
 *
 * Hoje a FlyBaterias ainda não possui essa base no site, então a função
 * retorna lista vazia e o seletor encaminha o cliente para um especialista
 * confirmar a aplicação. NUNCA preencha esta função com "chutes".
 */
export function findCompatibleBatteries(_vehicle: VehicleQuery): Product[] {
  void _vehicle;
  return [];
}
