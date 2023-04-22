import fetch from 'isomorphic-unfetch';

export default function handler(req, res) {
  const { query: { address } } = req;

 const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-api-key': process.env.API_KEY
  }
}

  const scanUrl = `https://api.poap.tech/actions/scan/${address}`;
  fetch(scanUrl, options)
    .then(res => res.json())
    .then(async (scanData) => {
      const events = [];
      for (const { event: { id: eventId } } of scanData) {
        let eventUrl = `https://api.poap.tech/event/${eventId}/poaps`;
        let eventOwners = [];
        let total = 1;
        let offset = 0;
        let limit = 300;
        while (offset < total) {
          const eventRes = await fetch(`${eventUrl}?offset=${offset}&limit=${limit}`, options);
          const eventJson = await eventRes.json();
          total = eventJson.total;
          offset += limit;
          eventOwners.push(...eventJson.tokens.map(token => token.owner.id));
        }
        events.push({ eventId, eventOwners });
      }
      const owners = {};
      for (const { eventId, eventOwners } of events) {
        for (const owner of eventOwners) {
          if (!owners[owner]) {
            owners[owner] = [];
          }
          owners[owner].push(eventId);
        }
      }
      const sortedOwners = Object.entries(owners)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([ownerId, events]) => ({ ownerId, events }));
      res.status(200).json(sortedOwners);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}
