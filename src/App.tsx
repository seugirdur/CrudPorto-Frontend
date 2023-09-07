import { useEffect, useState } from "react";
import { apiBackend } from "./api/axios";
import { ICliente, IMovimentacoes } from "./types/App";

export const App = () => {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<IMovimentacoes[][]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await apiBackend.get("/clientes");
        const clientesData = response.data.content;

        // Criar um objeto para mapear os clientes por nome
        const clientesPorNome: { [key: string]: IMovimentacoes[][] } = {};

        // Iterar pelos clientes e seus contêineres
        clientesData.forEach((cliente) => {
          const nomeCliente = cliente.name;

          // Inicializar um array vazio para o cliente, se ainda não existir
          if (!clientesPorNome[nomeCliente]) {
            clientesPorNome[nomeCliente] = [];
          }

          // Iterar pelos contêineres do cliente
          cliente.containers.forEach((container) => {
            const tipoMovimentacao = container.categoria;

            // Inicializar um array vazio para o tipo de movimentação, se ainda não existir
            if (!clientesPorNome[nomeCliente][tipoMovimentacao]) {
              clientesPorNome[nomeCliente][tipoMovimentacao] = [];
            }

            // Adicionar o contêiner ao array correspondente ao tipo de movimentação
            clientesPorNome[nomeCliente][tipoMovimentacao].push({
              conteiner: container,
            });
          });
        });

        // Agora temos os clientes organizados por nome e os contêineres agrupados por tipo de movimentação
        console.log(clientesPorNome);

        // Defina o estado com os dados organizados
        setMovimentacoes(clientesPorNome);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    };

    fetchApi();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">ID de Cliente</th>
              <th className="px-4 py-2">Nome do Cliente</th>
              <th className="px-4 py-2">Categoria de Conteiner</th>
              <th className="px-4 py-2">Contêineres</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(movimentacoes || {}).map((clienteNome) => {
              return Object.keys(movimentacoes[clienteNome] || {}).map((tipoMovimentacao) => {
                return movimentacoes[clienteNome][tipoMovimentacao].map((container, index) => (
                  <tr key={clienteNome + tipoMovimentacao + index}>
                    {index === 0 && (
                      <>
                        <td className="border px-4 py-2" rowSpan={movimentacoes[clienteNome][tipoMovimentacao].length}>
                          {clienteNome}
                        </td>
                        <td className="border px-4 py-2" rowSpan={movimentacoes[clienteNome][tipoMovimentacao].length}>
                          {clienteNome}
                        </td>
                      </>
                    )}
                    <td className="border px-4 py-2">{tipoMovimentacao}</td>
                    <td className="border px-4 py-2">{container.conteiner.numContainer}</td>
                  </tr>
                ));
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
