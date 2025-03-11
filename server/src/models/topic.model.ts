import { Schema, model, Document} from 'mongoose';

interface TopicType extends Document{
    topic : string,
    topicAccuracy : number,
    topicRecommendedTime : number,
}

const topicSchema = new Schema<TopicType>({
    topic :{
        type: String,
        require: true,
        unique:true,
        trim:true
    },
    topicAccuracy : {
        type:Number,
    },
    topicRecommendedTime : {
        type:Number
    }
},{
    timestamps:true
});

const Topic  = model<TopicType>('Topic', topicSchema);
export default Topic;