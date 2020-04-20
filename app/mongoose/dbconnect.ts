import { PaginateModel, Document, Schema, Model, model, connect } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const user = 'rtmsevents';
const pass = 'rtmsevents123';
const host = 'ds129342.mlab.com';
const port = 29342;
const database = 'rtms-events';

const connection = `mongodb://${user}:${pass}@${host}:${port}/${database}`;

// mongoose.Promise = global.Promise;
connect(connection);

interface IEvents extends Document {
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

const EventsSchema: Schema = new Schema({
  region: { type: String, required: true },
  name: { type: String, required: true },
  sport: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: false },
  cost: { type: String, required: false },
  location: { type: String, required: false },
  distance: { type: String, required: false },
  description: { type: String, required: false },
  entries: { type: String, required: false },
  image: { type: String, required: false },
  sortDate: { type: Date, required: true },
  isActive: { type: String, required: false, default: false },
});

interface IArticles extends Document {
  image: string;
  name: string;
  link: string;
  sport: string;
}

const ArticleSchema: Schema = new Schema({
  image: { type: String, required: false },
  name: { type: String, required: true },
  link: { type: String, required: true },
  sport: { type: String, required: true},
});

EventsSchema.plugin(mongoosePaginate);

interface IEventsModel<T extends Document> extends PaginateModel<T> {}

export const events: IEventsModel<IEvents> = model<IEvents>('events', EventsSchema);
export const articles: Model<IArticles> = model<IArticles>('articles', ArticleSchema);
