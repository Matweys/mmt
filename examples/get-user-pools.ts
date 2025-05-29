import { MmtSDK } from '../src';
import { ExtendedPool } from '../src/types';
import { PositionV3 } from '../src/types';

async function getUserPositionsJson(userAddress: string): Promise<PositionV3[]> {
  // Initialize SDK
  const sdk = MmtSDK.NEW({
    network: 'mainnet',
  });

  try {
    // Получаем все позиции пользователя
    const userPositions = await sdk.Position.getAllUserPositions(userAddress);
    // Мы не будем фильтровать по пулам здесь, просто вернем все позиции пользователя.
    // Если нужно фильтровать по конкретным пулам, логику можно добавить.
    return userPositions;

  } catch (error) {
    console.error('Error fetching user positions:', error);
    // В случае ошибки, возможно, лучше вернуть пустой массив или выбросить ошибку,
    // но для простоты вернем пустой массив.
    return [];
  }
}

// Главная часть для выполнения скрипта из командной строки
if (require.main === module) {
  const userAddress = process.argv[2]; // Получаем адрес пользователя из аргументов командной строки

  if (!userAddress) {
    console.error('Usage: ts-node examples/get-user-pools.ts <user_address>');
    process.exit(1);
  }

  getUserPositionsJson(userAddress)
    .then(positions => {
      console.log(JSON.stringify(positions, null, 2)); // Выводим результат в формате JSON с отступами
      process.exit(0);
    })
    .catch(error => {
      console.error('Script execution failed:', error);
      process.exit(1);
    });
}

// Экспортируем функцию, если потребуется использовать её в других модулях TS/JS
export { getUserPositionsJson };

export async function main() {
  // Initialize SDK
  const sdk = MmtSDK.NEW({
    network: 'mainnet',
  });

  // Замените на адрес пользователя, для которого хотите получить информацию
  const userAddress = '0x8d1780f2b1ab77dd94279499e368ecdca88811ed100ef480ca3ad902008b51ee';

  try {
    // Получаем все позиции пользователя
    const userPositions = await sdk.Position.getAllUserPositions(userAddress);
    console.log('User positions:', userPositions);

    // Получаем все пулы
    const allPools: ExtendedPool[] = await sdk.Pool.getAllPools();
    console.log('Total pools count:', allPools.length);

    // Фильтруем пулы, в которых у пользователя есть позиции
    const userPools = allPools.filter(pool => 
      userPositions.some(position => position.poolId === pool.poolId)
    );

    // Выводим детальную информацию о пулах пользователя
    console.log('\nUser pools details:');
    for (const pool of userPools) {
      const poolPositions = userPositions.filter(position => position.poolId === pool.poolId);
      
      console.log(`\nPool ID: ${pool.poolId}`);
      console.log(`Token X: ${pool.tokenX.ticker}`);
      console.log(`Token Y: ${pool.tokenY.ticker}`);
      console.log(`Number of positions in this pool: ${poolPositions.length}`);
      
      // Выводим информацию о каждой позиции в пуле
      for (const position of poolPositions) {
        console.log(`\nPosition ID: ${position.objectId}`);
        console.log(`Liquidity: ${position.liquidity}`);
        console.log(`Lower Price: ${position.lowerPrice}`);
        console.log(`Upper Price: ${position.upperPrice}`);
        console.log(`Status: ${position.status}`);
        console.log(`Amount: ${position.amount}`);
        console.log(`Claimable Rewards: ${position.claimableRewards}`);
        console.log(`Pooled ${pool.tokenX.ticker}: ${position.pooledAmountX}`);
        console.log(`Pooled ${pool.tokenY.ticker}: ${position.pooledAmountY}`);
      }
    }

  } catch (error) {
    console.error('Error fetching user pools:', error);
  }
}

main(); 