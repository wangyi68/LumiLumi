document.addEventListener('DOMContentLoaded', () => {
    const userId = "1391995229241868459"; //replace your discord id here
    const apiUrl = `https://discord-lookup-api-alpha.vercel.app/v1/user/${userId}`;

    const avatarFrame = document.getElementById('avatar-frame');

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data);

            if (data.avatar_decoration && data.avatar_decoration.asset) {
                const asset = data.avatar_decoration.asset;
                const frameUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}`;
                avatarFrame.src = frameUrl;
                avatarFrame.style.display = 'block';
            } else {
                console.warn("Has a frame.");
                avatarFrame.style.display = 'block';
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
});