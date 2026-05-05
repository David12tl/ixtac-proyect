import { TextEffect } from '../core/text-effect';

export function TextEffectPerWord() {
  return (
    <TextEffect 
      per='word' 
      as='h3' 
      preset='blur'
      className="text-[#57694f] text-xl md:text-2xl font-medium"
    >
      Ixtaczoquitlán
    </TextEffect>
  );
}