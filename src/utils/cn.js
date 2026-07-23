import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** twMerge
 * - 같은 그룹의 Tailwind 클래스가 중복되면 나중 값만 남기고 앞의 값을 지워줌
 * - (예: cn('bg-red-500', 'bg-blue-500') => 'bg-blue-500')
 * - 기본 twMerge는 globals.css의 커스텀 text-24-bold 같은 폰트 토큰을 모르고
 * text 컬러 클래스와 같은 그룹으로 잘못 인식해 지워버리므로, font-size 그룹을 직접 등록해줌
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            '24-bold',
            '24-semibold',
            '22-bold',
            '22-semibold',
            '20-bold',
            '20-semibold',
            '20-medium',
            '18-bold',
            '18-semibold',
            '18-medium',
            '18-regular',
            '16-bold',
            '16-semibold',
            '16-medium',
            '16-regular',
            '14-bold',
            '14-semibold',
            '14-medium',
            '14-regular',
            '13-bold',
            '13-semibold',
            '13-medium',
            '13-regular',
            '12-bold',
            '12-medium',
            '12-regular',
            'body-16-160',
            'body-16-130',
            'body-14-160',
            'body-14-130',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
