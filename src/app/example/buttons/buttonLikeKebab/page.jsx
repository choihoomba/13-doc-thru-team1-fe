'use client';

import { useState } from 'react';

import ExContainer from '@/app/example/_components/ExContainer';
import ExLayout from '@/app/example/_components/ExLayout';
import HighlightedText from '@/app/example/_components/HighlightedText';

import { cn } from '@/utils/cn';

import ButtonKebab from '@/components/ui/Button/ButtonKebab';
import ButtonLike from '@/components/ui/Button/ButtonLike';

export default function ButtonLikeKebabExPage() {
  const [status1, setStatus1] = useState('inactive');
  const [status2, setStatus2] = useState('active');
  const [status3, setStatus3] = useState('active');
  const [status4, setStatus4] = useState('inactive');

  return (
    <section className={cn('p-[50px]')}>
      <h1
        className={cn(
          'w-fit mb-[12px] py-[10px] px-[24px] text-24-bold bg-brand-black text-brand-yellow border-1 border-brand-black rounded-[12px]',
        )}
      >
        공통 ButtonLike, ButtonKebab 컴포넌트
      </h1>
      <h2 className={cn('mb-[24px] text-18-medium')}>
        - <HighlightedText text={`size`} /> : sm, lg
        <br />
        - <HighlightedText text={`status`} /> : active, inactive
        <br />
        - <HighlightedText text={`count`} /> : 숫자 직접 입력, 9,999 초과 시{' '}
        <HighlightedText text={`9,999...`} /> 로 표시
        <br />
        - 클릭 시 <HighlightedText text={`onClick`} /> 콜백만 호출되며, 실제
        active/inactive 상태 변경은 부모(사용하는 쪽)에서 처리합니다.
        <br />
        - <HighlightedText text={`disabled`} /> : true일 경우 클릭 불가 (하트
        이미지만 클릭 영역이며, count 텍스트는 클릭되지 않습니다. <br />
        <span className={cn('pl-[105px]')}>마감 시 못 누르게 하는 용도)</span>
        <br />
        - <HighlightedText text={`className`} /> : 최상위 요소에 병합되어
        외부에서 마진/위치 조정이 가능합니다.
      </h2>

      <ExLayout title="ButtonLike 컴포넌트">
        <ExContainer>
          <div className={cn('flex flex-col gap-[8px] mb-[8px]')}>
            <span className={cn('text-16-semibold')}>
              🥕 size=&quot;sm&quot;
            </span>
            <ButtonLike
              size="sm"
              count={12}
              status={status1}
              onClick={() =>
                setStatus1((prev) =>
                  prev === 'active' ? 'inactive' : 'active',
                )
              }
            />
          </div>

          <div className={cn('flex flex-col gap-[8px] mb-[8px]')}>
            <span className={cn('text-16-semibold')}>
              🥕 size=&quot;lg&quot;
            </span>
            <ButtonLike
              size="lg"
              count={128}
              status={status2}
              onClick={() =>
                setStatus2((prev) =>
                  prev === 'active' ? 'inactive' : 'active',
                )
              }
            />
          </div>

          <div className={cn('flex flex-col gap-[8px] mb-[8px]')}>
            <span className={cn('text-16-semibold')}>
              🥕 count가 9,999를 초과하는 경우
            </span>
            <ButtonLike
              size="lg"
              count={15234}
              status={status3}
              onClick={() =>
                setStatus3((prev) =>
                  prev === 'active' ? 'inactive' : 'active',
                )
              }
            />
          </div>

          <div className={cn('flex flex-col gap-[8px]')}>
            <span className={cn('text-16-semibold')}>
              🥕 disabled - 클릭 불가
            </span>
            <ButtonLike
              size="lg"
              count={42}
              status={status4}
              disabled
              onClick={() =>
                setStatus4((prev) =>
                  prev === 'active' ? 'inactive' : 'active',
                )
              }
            />
          </div>
        </ExContainer>
      </ExLayout>

      <h2 className={cn('mt-[40px] mb-[24px] text-18-medium')}>
        - <HighlightedText text={`onEdit`} />,{' '}
        <HighlightedText text={`onDelete`} />
        {' : 각각 "수정하기", "삭제하기" 클릭 시 호출되는 콜백'}
        <br />- 열림/닫힘 상태는 컴포넌트 내부에서 관리하며, 바깥 클릭 시
        자동으로 닫힙니다.
        <br />- <HighlightedText text={`className`} />
        {' : 최상위 요소에 병합되어 외부에서 마진/위치 조정이 가능합니다.'}
        <br />- 노출 여부(어드민/작성자 등 권한 판단)는 컴포넌트 책임이 아니며,
        사용하는 쪽에서 조건부 렌더링으로 처리합니다.
        <br />- 키보드(Tab)로 다른 케밥 버튼에 포커스를 이동해 열 때도, 이전에
        열려있던 메뉴는 자동으로 닫힙니다{' '}
        <HighlightedText text={`useOutsideClick`} />의{' '}
        <HighlightedText text={`detectFocus`} /> 옵션 사용).
      </h2>

      <ExLayout title="ButtonKebab 컴포넌트">
        <ExContainer>
          <div className={cn('flex flex-col gap-[8px] mb-[16px]')}>
            <span className={cn('text-16-semibold')}>
              🥕 기본 사용 (Tab으로 다른 케밥 열어보며 확인)
            </span>
            <div
              className={cn(
                'flex items-start justify-between w-[660px] p-[16px]',
                'border border-solid border-gray-300 rounded-[8px]',
              )}
            >
              <span className={cn('text-16-semibold')}>
                개발자로써 자신만의 브랜드를 구축하는 방법(dailydev)
              </span>
              <ButtonKebab
                onEdit={() => alert('수정하기 클릭')}
                onDelete={() => alert('삭제하기 클릭')}
              />
            </div>
          </div>

          <div className={cn('flex flex-col gap-[8px]')}>
            <span className={cn('text-16-semibold')}>
              🥕 다른 케밥 버튼 (동시에 안 열리는지 확인용)
            </span>
            <div
              className={cn(
                'flex items-start justify-between w-[660px] p-[16px]',
                'border border-solid border-gray-300 rounded-[8px]',
              )}
            >
              <span className={cn('text-16-semibold')}>
                Web 개발자의 필수 요건
              </span>
              <ButtonKebab
                onEdit={() => alert('수정하기 클릭')}
                onDelete={() => alert('삭제하기 클릭')}
              />
            </div>
          </div>
        </ExContainer>
      </ExLayout>
    </section>
  );
}
