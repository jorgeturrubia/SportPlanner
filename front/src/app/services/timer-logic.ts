export class TimerLogic {
    public generalTime: number = 0;
    public exerciseTime: number = 0;

    constructor() {}

    tick(): { autoTransition: boolean } {
        this.generalTime++;
        if (this.exerciseTime > 0) {
            this.exerciseTime--;
            if (this.exerciseTime === 0) {
                return { autoTransition: true };
            }
        }
        return { autoTransition: false };
    }

    setExerciseTime(minutes: number) {
        this.exerciseTime = minutes * 60;
    }

    resetGeneralTime() {
        this.generalTime = 0;
    }
}
