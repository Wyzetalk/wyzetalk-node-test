import { events } from '../mongoose/dbconnect';
import moment from 'moment';

interface IEvent {
  _id: string;
  region: string;
  name: string;
  sport: 'running' | 'cycling';
  type: string;
  date: string;
  cost: string;
  location: string;
  distance: string;
  description: string;
  entries: string;
  image: string;
  sortDate: string;
  isActive: boolean;
}

const filterResults = (data: IEvent[], query: string, column: string) => {
  return data.filter((x) => x[column].toLowerCase() === query);
};

const time = moment().startOf('day');

export async function getAllEvents(sport) {
  try {
    return await events.find({
      sport,
      sortDate: {
        $gte: time.toDate(),
      },
    })
      .sort([['sortDate', 'ascending']]);
  } catch (error) {
    return error;
  }
}

export async function addNewEvent(event: IEvent) {
  try {
    return await events.create(event);
  } catch (error) {
    return error;
  }
}

export async function getEventsByProvince(
  sport: string,
  region: string,
  isArchive: boolean = false,
) {
  const direction = isArchive ? '$lte' : '$gte';

  try {
    return await events.find({
      sport,
      region: new RegExp(region, 'i'),
      sortDate: {
        [direction]: time.toDate(),
      },
    })
      .sort([['sortDate', 'ascending']]);
  } catch (error) {
    return error;
  }
}

export async function getEventById(_id: string) {
  try {
    return await events.find({ _id });
  } catch (error) {
    return error;
  }
}

export async function getDuplicateEvents() {
  try {
    return await events.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]);
  } catch (error) {
    return error;
  }
}
// , sortDate: { $gte: time.toDate() }
export async function removeEventById(_id: string) {
  try {
    return await events.deleteOne({ _id });
  } catch (error) {
    return error;
  }
}

export async function getEventBySearch(query: string) {
  try {
    return await events.find({
      name: new RegExp(query, 'i'),
      sortDate: {
        $gte: time.toDate(),
      },
    })
      .sort([['sortDate', 'ascending']]);
  } catch (error) {
    return error;
  }
}

export async function getPagedEvents(
  offset: number = 0,
  limit: number = 10,
  sport: string,
) {
  try {
    return await events.paginate({
      sport,
      sortDate: {
        $gte: new Date(),
      },
    }, {
        limit: +limit,
        offset: +offset,
        sort: {
          sortDate: 1,
        },
      });
  } catch (error) {
    return error;
  }
}

export async function getAppData(sport: string) {
  try {
    const past = moment().startOf('day').subtract(2, 'days');

    const results = await events
      .find({ sortDate: { $gte: past.toDate() } })
      .sort([['sortDate', 'ascending']]);

    const running = await filterResults(results, 'running', 'sport');
    const cycling = await filterResults(results, 'cycling', 'sport');

    const provinces = await {
      running: {
        EC: await filterResults(running, 'ec', 'region'),
        FS: await filterResults(running, 'fs', 'region'),
        KN: await filterResults(running, 'kn', 'region'),
        LI: await filterResults(running, 'li', 'region'),
        GA: await filterResults(running, 'ga', 'region'),
        MP: await filterResults(running, 'mp', 'region'),
        NC: await filterResults(running, 'nc', 'region'),
        NW: await filterResults(running, 'nw', 'region'),
        WC: await filterResults(running, 'wc', 'region'),
      },
      cycling: {
        EC: await filterResults(cycling, 'ec', 'region'),
        FS: await filterResults(cycling, 'fs', 'region'),
        KN: await filterResults(cycling, 'kn', 'region'),
        LI: await filterResults(cycling, 'li', 'region'),
        GA: await filterResults(cycling, 'ga', 'region'),
        MP: await filterResults(cycling, 'mp', 'region'),
        NC: await filterResults(cycling, 'nc', 'region'),
        NW: await filterResults(cycling, 'nw', 'region'),
        WC: await filterResults(cycling, 'wc', 'region'),
      },
    };

    return provinces;
  } catch (error) {
    return error;
  }
}

export async function getUpcomingEvents(from: string, to: string) {
  const startTime = moment(from).startOf('day');
  const endTime = moment(to).endOf('day');

  try {
    const results = await events.find({
      sortDate: {
        $gte: startTime.toDate(),
        $lte: endTime.toDate(),
      },
    })
      .select({
        name: 1,
        date: 1,
        region: 1,
        sport: 1,
        sortDate: 1,
      })
      .sort([['sortDate', 'ascending']]);
    const running = await filterResults(results, 'running', 'sport');
    const cycling = await filterResults(results, 'cycling', 'sport');

    const provinces = await {
      running: {
        EC: await filterResults(running, 'ec', 'region'),
        FS: await filterResults(running, 'fs', 'region'),
        KN: await filterResults(running, 'kn', 'region'),
        LI: await filterResults(running, 'li', 'region'),
        GA: await filterResults(running, 'ga', 'region'),
        MP: await filterResults(running, 'mp', 'region'),
        NC: await filterResults(running, 'nc', 'region'),
        NW: await filterResults(running, 'nw', 'region'),
        WC: await filterResults(running, 'wc', 'region'),
      },
      cycling: {
        EC: await filterResults(cycling, 'ec', 'region'),
        FS: await filterResults(cycling, 'fs', 'region'),
        KN: await filterResults(cycling, 'kn', 'region'),
        LI: await filterResults(cycling, 'li', 'region'),
        GA: await filterResults(cycling, 'ga', 'region'),
        MP: await filterResults(cycling, 'mp', 'region'),
        NC: await filterResults(cycling, 'nc', 'region'),
        NW: await filterResults(cycling, 'nw', 'region'),
        WC: await filterResults(cycling, 'wc', 'region'),
      },
    };

    return {
      ...provinces,
      count: results.length,
    };
  } catch (error) {
    return error;
  }
}

export async function getNextEvents() {
  try {
    const running = await events.find({
      sport: 'running',
      sortDate: {
        $gte: time.toDate(),
      },
    })
      .sort([['sortDate', 'ascending']])
      .limit(1);

    const cycling = await events.find({
      sport: 'cycling',
      sortDate: {
        $gte: time.toDate(),
      },
    })
      .sort([['sortDate', 'ascending']])
      .limit(1);

    return [
      ...running,
      ...cycling,
    ];
  } catch (error) {
    return error;
  }
}
