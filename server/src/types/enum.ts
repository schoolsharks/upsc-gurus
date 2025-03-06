export enum SectionEnum {
    QUANTITATIVE = 'QUANTITATIVE',
    VERBAL = 'VERBAL',
    QUANTITATIVE_2 = 'QUANTITATIVE_2',
    VERBAL_2 = 'VERBAL_2',
    ANALYTICAL = 'ANALYTICAL',
}

export enum DifficultyEnum {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD'
}

export enum TestStatusEnum{
    NOT_STARTED = 'NOT_STARTED',   
    IN_PROGRESS = 'IN_PROGRESS',   
    COMPLETED = 'COMPLETED',       
    LOCKED = 'LOCKED', 
    TIME_EXCEEDED = 'TIME_EXCEEDED'
}

export enum SetEnum {
    SET_1 = 'SET_1',
    SET_2 = 'SET_2',
    SET_3 = 'SET_3',
    SET_4 = 'SET_4',
    SET_5 = 'SET_5'
}

export enum SetStatusEnum{
    NOT_STARTED = 'NOT_STARTED',   
    IN_PROGRESS = 'IN_PROGRESS',   
    COMPLETED = 'COMPLETED',       
    LOCKED = 'LOCKED', 
    TIME_EXCEEDED = 'TIME_EXCEEDED'
}

export enum QuestionStatusEnum {
    UNSEEN = 'UNSEEN',
    SEEN = 'SEEN',
    ATTEMPTED = 'ATTEMPTED',
    MARKED = 'MARKED',
};

export enum PaymentEnum{
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}
