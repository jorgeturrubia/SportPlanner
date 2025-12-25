import { TimerLogic } from './timer-logic';

describe('TimerLogic', () => {
    let logic: TimerLogic;

    beforeEach(() => {
        logic = new TimerLogic();
    });

    it('should initialize with zeros', () => {
        expect(logic.generalTime).toBe(0);
        expect(logic.exerciseTime).toBe(0);
    });

    it('should increment general time on tick', () => {
        logic.tick();
        expect(logic.generalTime).toBe(1);
    });

    it('should decrement exercise time on tick if active', () => {
        logic.setExerciseTime(1); // 1 minute = 60s
        expect(logic.exerciseTime).toBe(60);

        logic.tick();
        expect(logic.exerciseTime).toBe(59);
    });

    it('should return autoTransition=true when exercise time hits zero', () => {
        logic.exerciseTime = 1; // 1 second left
        const result = logic.tick();
        
        expect(logic.exerciseTime).toBe(0);
        expect(result.autoTransition).toBe(true);
    });

    it('should not transition if exercise time is already zero', () => {
        logic.exerciseTime = 0;
        const result = logic.tick();
        expect(result.autoTransition).toBe(false);
    });
});