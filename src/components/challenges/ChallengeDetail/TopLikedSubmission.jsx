'use client';

import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useTopLikedSubmission } from '@/hooks/queries/submissions/queries';

import { cn } from '@/utils/cn';

import TopLikedSubmissionItem from '@/components/challenges/ChallengeDetail/TopLikedSubmissionItem';
import ButtonCircle from '@/components/ui/Button/ButtonCircle';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

/** 최다 추천 번역 섹션 */
export default function TopLikedSubmission({ challengeId }) {
  const {
    data: submission,
    isPending,
    isError,
  } = useTopLikedSubmission(challengeId);

  if (isPending) return <LoadingDisplay />;
  if (isError) return <ErrorDisplay />;
  if (!submission) return null; // 등록된 작업물이 하나도 없으면 섹션 자체 숨김 처리

  const topLikedSubmissions = submission.filter((s) => s.isTopSubmission);

  // 최다 추천 번역 없음
  if (topLikedSubmissions.length === 0) return null;

  // 최다 추천 번역 1개
  if (topLikedSubmissions.length === 1)
    return (
      <section>
        <TopLikedSubmissionItem
          challengeId={challengeId}
          submission={submission[0]}
        />
      </section>
    );

  // 최다 추천 번역 2개 이상

  return (
    <section>
      <Swiper
        navigation={{
          prevEl: '.top-liked-swiper-prev',
          nextEl: '.top-liked-swiper-next',
        }}
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={1.07}
        breakpoints={{
          744: {
            spaceBetween: 24,
            slidesPerView: 1.07,
          },
        }}
        className={cn(
          '[&_.swiper-button-disabled]:opacity-0!',
          '[&_.swiper-button-disabled]:pointer-events-none!',
          '[&_.swiper-slide:not(.swiper-slide-active)]:opacity-20',
        )}
      >
        {/* TODO: 화살표 position 확인 */}
        <ButtonCircle
          variant="secondary"
          aria-label="이전"
          className="top-liked-swiper-prev absolute top-1/2 left-[26px] tablet:left-[40px] z-10 -translate-y-1/2 rotate-180 transition-opacity duration-300"
        />
        <ButtonCircle
          variant="secondary"
          aria-label="다음"
          className="top-liked-swiper-next absolute top-1/2 right-[26px] tablet:right-[40px] z-10 -translate-y-1/2 transition-opacity duration-300"
        />
        {submission.map(
          (s) =>
            s.isTopSubmission && (
              <SwiperSlide key={s.id}>
                <TopLikedSubmissionItem
                  challengeId={challengeId}
                  submission={s}
                />
              </SwiperSlide>
            ),
        )}
      </Swiper>
    </section>
  );
}
