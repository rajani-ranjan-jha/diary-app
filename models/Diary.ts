import mongoose, { Schema, Model, models } from 'mongoose';

export interface IDiary {
    _id?: string;
    title: string;
    content: string;
    date_created: Date;
    date_modified: Date;
}

const DiarySchema = new Schema<IDiary>({
    title: {
        type: String,
        // required: false,
        // default: 'Title',
    },
    content: {
        type: String,
        // required: false,
        // default: 'Content'
    },
    date_created: {
        type: Date,
        default: Date.now,
    },
    date_modified: {
        type: Date,
        default: Date.now,
    },
});

const Diary: Model<IDiary> = models.Diary || mongoose.model<IDiary>('Diary', DiarySchema);

export default Diary;
