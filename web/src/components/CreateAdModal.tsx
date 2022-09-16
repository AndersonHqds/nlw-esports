import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import Input from "./Form/Input";
import { Check, GameController } from "phosphor-react";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";

interface Game {
  id: string;
  title: string;
}

export default function CreateAdModal() {
  const [games, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoiceChannel, setUseVoiceChannel] = useState<boolean>(false);

  useEffect(() => {
    axios("http://localhost:3333/games").then(({ data }) => {
      setGames(data);
    });
  }, []);

  const tableGroupIsSelected = (weekDayToTest: string) => {
    return weekDays.includes(weekDayToTest) ? "bg-violet-500" : "bg-zinc-900";
  };

  const handleCreateAd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.table({ data, weekDays, useVoiceChannel });
    try {
      axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel,
      });
      alert("Anuncio criado com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao criar o anúncio!");
    }
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="fixed bg-[#2a2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rouded-lg w-[480px] shadow-lg shadow-black/25">
        <Dialog.Title className="text-3xl font-black">
          Publique um anúncio
        </Dialog.Title>

        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="game" className="font-semibold">
              Qual o game?
            </label>
            <select
              className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500"
              id="game"
              defaultValue=""
              name="game"
            >
              <option disabled>Selecione o game que deseja jogar</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name">Seu nome (ou nickname)</label>
            <Input
              type="text"
              placeholder="Como te chamam dentro do game?"
              id="name"
              name="name"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
              <Input
                type="number"
                placeholder="Tudo bem ser ZERO"
                id="yearsPlaying"
                name="yearsPlaying"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="discord">Qual o seu Discord?</label>
              <Input
                type="text"
                placeholder="Usuário#0000"
                id="discord"
                name="discord"
              />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="weekDays">Quando costuma jogar?</label>
              <ToggleGroup.Root
                type="multiple"
                className="grid grid-cols-4 gap-2"
                value={weekDays}
                onValueChange={setWeekDays}
              >
                <ToggleGroup.Item
                  title="Domingo"
                  className={`w-8 h-8 rounded  ${tableGroupIsSelected("0")}`}
                  value="0"
                >
                  D
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  title="Segunda"
                  className={`w-8 h-8 rounded  ${tableGroupIsSelected("1")}`}
                  value="1"
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  title="Terça"
                  className={`w-8 h-8 rounded  ${tableGroupIsSelected("2")}`}
                  value="2"
                >
                  T
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  title="Quarta"
                  className={`w-8 h-8 rounded  ${tableGroupIsSelected("3")}`}
                  value="3"
                >
                  Q
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  title="Quinta"
                  className={`w-8 h-8 rounded  ${tableGroupIsSelected("4")}`}
                  value="4"
                >
                  Q
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  title="Sexta"
                  className={`w-8 h-8 rounded  ${tableGroupIsSelected("5")}`}
                  value="5"
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  title="Sábado"
                  className={`w-8 h-8 rounded  ${tableGroupIsSelected("6")}`}
                  value="6"
                >
                  S
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="hourStart">Qual horário do dia?</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  placeholder="De"
                  id="hourStart"
                  name="hourStart"
                />
                <Input
                  type="time"
                  placeholder="Até"
                  id="hourEnd"
                  name="hourEnd"
                />
              </div>
            </div>
          </div>
          <label className="mt-2 flex gap-2 text-sm items-center">
            <Checkbox.Root
              onCheckedChange={(checked) => {
                if (typeof checked === "boolean") {
                  setUseVoiceChannel(checked);
                }
              }}
              className="w-6 h-6 p-1 rounded bg-zinc-900"
            >
              <Checkbox.Indicator>
                <Check className="w-4 h-4 text-emerald-400" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            Costumo me conectar ao chat de voz
          </label>

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close
              type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
            >
              Cancelar
            </Dialog.Close>
            <button
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
              type="submit"
            >
              <GameController size={24} /> Encontrar duo
            </button>
          </footer>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
