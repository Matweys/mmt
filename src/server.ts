import express from 'express';
import { getUserPositionsJson } from '../examples/get-user-pools'; // Импортируем вашу функцию

const app = express();
const port = 3000; // Вы можете выбрать другой порт

app.use(express.json()); // Для парсинга JSON в теле запроса (если потребуется в будущем)

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is working!' });
});

// Определяем GET маршрут для получения данных пулов пользователя
app.get('/user_pools/:user_address', async (req, res) => {
  const userAddress = req.params.user_address; // Получаем адрес пользователя из URL

  if (!userAddress) {
    return res.status(400).json({ error: 'User address is required' });
  }

  try {
    console.log(`Fetching pools for user: ${userAddress}`);
    const userPositions = await getUserPositionsJson(userAddress); // Вызываем вашу функцию

    // Возвращаем результат в формате JSON
    res.status(200).json(userPositions);

  } catch (error) {
    console.error(`Error fetching user pools for ${userAddress}:`, error);
    res.status(500).json({ error: 'Failed to fetch user pools' });
  }
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Example usage: http://localhost:${port}/user_pools/0x8d1780f2b1ab77dd94279499e368ecdca88811ed100ef480ca3ad902008b51ee`);
}); 