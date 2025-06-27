export class StoryModel {
    constructor({ id, name, description, photoUrl, createdAt, lat, lon }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;
        this.lat = lat;
        this.lon = lon;
    }

    static fromJson(json) {
        return new StoryModel({
            id: json.id,
            name: json.name,
            description: json.description,
            photoUrl: json.photoUrl,
            createdAt: json.createdAt,
            lat: json.lat,
            lon: json.lon,
        });
    }
}
