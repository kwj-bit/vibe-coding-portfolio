document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'f2360fec49cfb104a859e50f59d0a5b9';
    const API_URL = `https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1&region=KR&api_key=${API_KEY}`;
    const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
    const grid = document.getElementById('mvGrid');

    if (!grid) return;

    // initial skeletons
    grid.innerHTML = Array.from({ length: 12 }).map(() => `
        <div class="mv-card" aria-hidden="true">
            <div class="mv-poster"></div>
            <div class="mv-title-text" style="color:#444">&nbsp;</div>
        </div>
    `).join('');

    fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error('요청 실패');
            return res.json();
        })
        .then(data => {
            const movies = Array.isArray(data.results) ? data.results : [];
            grid.innerHTML = movies.map(m => {
                const title = m.title || m.name || '제목 없음';
                const releaseDate = m.release_date || '';
                const poster = m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : '';
                const posterEl = poster ? `<img class=\"mv-poster\" src=\"${poster}\" alt=\"${title}\">` : `<div class=\"mv-poster\"></div>`;
                return `
                    <div class=\"mv-card\" tabindex=\"0\">
                        ${posterEl}
                        <div class=\"mv-title-text\">${title}</div>
                        ${releaseDate ? `<div class=\"mv-date\">${releaseDate}</div>` : ''}
                    </div>
                `;
            }).join('');
        })
        .catch(err => {
            console.error(err);
            grid.innerHTML = `<div style="padding:20px 0; color:#9aa0a6;">목록을 불러오지 못했어요. 새로고침 해주세요.</div>`;
        });
});
