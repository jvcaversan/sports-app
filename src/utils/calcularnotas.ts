import { Time } from "../types/types";

export default function calcularNotaTotal(time: Time): number {
  const todosJogadores = [
    ...time.goleiros,
    ...time.zagueiros,
    ...time.lateraisDireitos,
    ...time.lateraisEsquerdos,
    ...time.meias,
    ...time.atacantes,
  ].filter(Boolean);

  return todosJogadores.reduce(
    (total, jogador) => total + (jogador?.nota || 0),
    0
  );
}
