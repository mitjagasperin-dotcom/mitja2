import campusLevel from "./levels/campus.json";
import lessonIntroPentagon from "./dialogues/lesson_intro_pentagon.json";
import triangleHintOrbit from "./dialogues/triangle_hint_orbit.json";
import squareStudyGroup from "./dialogues/square_study_group.json";
import roomRt from "./rooms/room_rt_1.json";
import roomCircle from "./rooms/room_circle_1.json";
import puzzleRt from "./puzzles/rt_leg_hypotenuse_basic.json";
import puzzleCircle from "./puzzles/circle_arc_ratio.json";
import { GameContent } from "@app/world";

export const defaultContent: GameContent = {
  levels: {
    [campusLevel.id]: campusLevel,
  },
  rooms: {
    [roomRt.id]: roomRt,
    [roomCircle.id]: roomCircle,
  },
  dialogues: {
    [lessonIntroPentagon.id]: lessonIntroPentagon,
    [triangleHintOrbit.id]: triangleHintOrbit,
    [squareStudyGroup.id]: squareStudyGroup,
  },
  puzzles: {
    [puzzleRt.id]: puzzleRt,
    [puzzleCircle.id]: puzzleCircle,
  },
};
