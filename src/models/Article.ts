import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  body: string;
  coverImage: string;
  readTime: string;
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title:       { type: String, required: true },
    slug:        { type: String, required: true, unique: true },
    tag:         { type: String, default: 'Editorial' },
    excerpt:     { type: String, default: '' },
    body:        { type: String, default: '' },
    coverImage:  { type: String, default: '' },
    readTime:    { type: String, default: '3 min read' },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Article ?? mongoose.model<IArticle>('Article', ArticleSchema);
