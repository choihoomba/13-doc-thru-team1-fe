/** buildRanks
 * - 좋아요 수가 같으면 같은 순위(공동 순위)를 부여
 * - 다음 순위는 공동 순위 인원 수만큼 건너뛰지 않고 이어서 부여 (예: 1,1,2,3 / not 1,1,3,4)
 * - submissions는 likes 내림차순으로 정렬되어 있어야 함
 */
export default function buildRanks(submissions, baseRank) {
  const ranks = [];
  submissions.forEach((s, i) => {
    if (i === 0) {
      ranks.push(baseRank);
      return;
    }
    const tiesWithPrev = s._count.likes === submissions[i - 1]._count.likes;
    ranks.push(tiesWithPrev ? ranks[i - 1] : ranks[i - 1] + 1);
  });
  return ranks;
}
