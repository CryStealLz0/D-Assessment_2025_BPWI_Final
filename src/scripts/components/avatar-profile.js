export class AvatarProfile {
    constructor(containerId, name) {
        this.container = document.getElementById(containerId);
        this.name = name;
    }

    generate(size = 64) {
        const colors = [
            '#00ADB5',
            '#393E46',
            '#F38181',
            '#3F72AF',
            '#2D4059',
            '#FF5722',
            '#009688',
        ];
        const nameParts = this.name.trim().split(/\s+/).slice(0, 3);
        const initials = nameParts
            .map((part) => part[0].toUpperCase())
            .join('');
        const bgColor = colors[Math.floor(Math.random() * colors.length)];

        this.container.innerHTML = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        box-shadow: 2px 2px 5px rgba(40, 40, 40, 1);
        background-color: ${bgColor};
        color: white;
        font-size: ${size / 2.5}px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
      ">
        ${initials}
      </div>
    `;
    }
}
