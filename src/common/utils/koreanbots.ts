import { ClusterClient, ClusterManager } from 'discord-hybrid-sharding';
import { Log } from './log';
import { DiscordUtil } from './discord';

export class Koreanbots {
  static async update(cluster: ClusterManager | ClusterClient) {
    try {
      if (!process.env.KOREANBOTS_TOKEN) return;
      const result = await fetch(
        `https://koreanbots.dev/api/v2/bots/${DiscordUtil.clientId}/stats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.KOREANBOTS_TOKEN,
          },
          body: JSON.stringify({
            servers: (
              (await cluster?.fetchClientValues(
                'guilds.cache.size',
              )) as number[]
            ).reduce((a, b) => a + b, 0),
            shards:
              cluster instanceof ClusterClient
                ? cluster.info.TOTAL_SHARDS
                : cluster.totalShards,
          }),
        },
      );
      if (!result.ok)
        Log.error(
          `Koreanbots.update error\n${JSON.stringify(await result.json())}`,
        );
    } catch (e) {
      Log.error(e, __filename);
    }
  }
}
