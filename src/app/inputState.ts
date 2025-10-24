export interface InputState {
  forward: number;
  right: number;
  rotation: number;
  talk: boolean;
}

export const defaultInputState: InputState = {
  forward: 0,
  right: 0,
  rotation: 0,
  talk: false,
};
