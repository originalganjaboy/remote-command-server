const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const comandos = [];

app.post('/api/comandos', (req, res) => {
  const { deviceId, comando } = req.body;
  if (!deviceId || !comando) return res.status(400).json({ error: 'Parâmetros inválidos.' });
  comandos.push({ deviceId, comando, executado: false });
  res.json({ message: 'Comando registrado com sucesso.' });
});

app.get('/api/comandos', (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) return res.status(400).json({ error: 'deviceId é obrigatório.' });

  const pendentes = comandos.filter(
    cmd => (cmd.deviceId === deviceId || cmd.deviceId === "all") && !cmd.executado
  );
  res.json(pendentes);
});

app.post('/api/comandos/executado', (req, res) => {
  const { deviceId, comando } = req.body;
  comandos.forEach(cmd => {
    if ((cmd.deviceId === deviceId || cmd.deviceId === "all") && cmd.comando === comando && !cmd.executado) {
      cmd.executado = true;
    }
  });
  res.json({ message: 'Comando marcado como executado.' });
});

app.listen(PORT, () => {
  console.log(`Servidor remoto rodando em porta ${PORT}`);
});
