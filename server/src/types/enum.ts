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


export enum AccountStatusEnum {
    TRIAL = 'TRIAL',                          // Account in trial period (within 48 hours)
    TRIAL_EXPIRED = 'TRIAL_EXPIRED',          // Trial period ended, waiting for payment
    ACTIVE = 'ACTIVE',                        // Account fully active after payment
    INACTIVE = 'INACTIVE',                    // Account inactive, could be due to failed payment or user action
    PAYMENT_PENDING = 'PAYMENT_PENDING',      // User has initiated payment, but it's pending
    CANCELLED = 'CANCELLED',                  // Account cancelled, user can no longer access
    SUSPENDED = 'SUSPENDED',                   // Account suspended due to policy violations or other reasons
    SUBSCRIPTION_EXPIRED='SUBSCRIPTION_EXPIRED'
}

export enum PackageEnum {
    PRELIMS = 'Prelims',
    PYQ = 'Previous Year Questions (PYQs)',
    COMBINED = 'Comprehensive Prelims Preparation (Prelims + PYQs)'
}


export enum TestTypes{
  TEST_SERIES="TEST_SERIES",
  PYQS="PYQS",
}