export const TASK_STATUS = {
    OPEN: 'open',
    ACCEPTED: 'accepted',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
}

const VALID_TRANSITIONS = {
    [TASK_STATUS.OPEN]: [TASK_STATUS.ACCEPTED, TASK_STATUS.CANCELLED],
    [TASK_STATUS.ACCEPTED]: [TASK_STATUS.COMPLETED, TASK_STATUS.CANCELLED],
    [TASK_STATUS.COMPLETED]: [],
    [TASK_STATUS.CANCELLED]: [],
}

export const canTransition = (from, to) => {
    const allowed = VALID_TRANSITIONS[from]
    if (!allowed) return false
    return allowed.includes(to)
}
