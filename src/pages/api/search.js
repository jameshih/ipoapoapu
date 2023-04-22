const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-api-key': process.env.API_KEY
  }
}

export default function handler(req, res) {
  const {address} = req.query;
  const eventIds = [];
  const owners = {};

  fetch(`https://api.poap.tech/actions/scan/${address}`, options)
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        eventIds.push(item.event.id);
      });
      return eventIds;
    })
    .then(ids => Promise.all(ids.map(id => {
      const ownerIds = [];
      let total = 0;
      let offset = 0;
      let limit = 300;

      const getOwners = () => {
        return fetch(`https://api.poap.tech/event/${id}/poaps?limit=${limit}&offset=${offset}`, options)
          .then(response => response.json())
          .then(data => {
            total = data.total;
            data.tokens.forEach(token => {
              ownerIds.push(token.owner.id);
            });
            offset += limit;
            limit = total - offset > limit ? limit : total - offset;
            if (offset < total) {
              return getOwners();
            } else {
              owners[id] = ownerIds;
            }
          });
      };

      return getOwners();
    })))
    .then(() => {
      const result = [];
      Object.keys(owners).forEach(ownerId => {
        owners[ownerId].forEach(eventId => {
          if (!result[ownerId]) {
            result[ownerId] = { ownerId, eventIds: [eventId] };
          } else {
            result[ownerId].eventIds.push(eventId);
          }
        });
      });
      result.sort((a, b) => b.eventIds.length - a.eventIds.length);
      res.status(200).json(result);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Something went wrong');
    });
}