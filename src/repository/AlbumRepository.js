const Album = require("../models/Album")
const User = require("../models/user")
const  AlbumDto  = require("../common/dto/AlbumDto");

class AlbumRepository {
    async create(data, UserID) {
        try {
            const user = await User.findByPk(UserID)
            if(!user) {
                throw new Error("User tidak ditemukan");
            }
            const album = await Album.create({
                ...data,
                TanggalDibuat: new Date(),
                UserID: UserID
            })
            return new AlbumDto(album)
        } catch (error) {
            throw new Error("Terjadi kesalahan dalam membuat album baru: " + error.message); 
        }
    }

    async getAll() {
        try {
            const album = await Album.findAll({
                include: [
                    {
                        model: User,
                        attributes: ["UserID", "Username", "Profile"]
                    }
                ]
            });
            return album.map((albums) => new AlbumDto(albums))
        } catch (error) {
            throw new Error("Terjadi kesalahan saat mengambil semua data album: " + error.message)
        }
    }

    async getById(AlbumID) {
        try {
            const album = await Album.findByPk(AlbumID, {
                include: [
                    {
                        model: User,
                        attributes: ["UserID", "Username", "Profile"],
                    }
                ]
            });
            if(!album) {
                throw new Error("Album tidak ditemukan");
            }

            return new AlbumDto(album)
        } catch (error) {
            throw new Error("Terjadi kesalahan saat mengambil data album: " + error.message);
        }
    }

    async getByUserID(UserID) {
        try {
            const album = await Album.findAll({
                where: { UserID: UserID },
                include: [
                    {
                        model: User,
                        attributes: ["UserID", "Username", "Profile"]
                    }
                ]
            })
            return album.map((albums) => new AlbumDto(albums))
        } catch (error) {
            throw new Error("Gagal mengambil data album berdasarkan UserID" + error.message);
        }
    }

    async update(AlbumID, data) {
        try {
            const album = await Album.findByPk(AlbumID)
            if(!album) {
                throw new Error("Album tidak ditemukan");
            }
            await album.update(data)
            return new AlbumDto(album)
        } catch (error) {
            throw new Error("Terjadi kesalahan saat memperbarui data album: " + error.message);
        }
    }

    async delete(AlbumID) {
        try {
            const album = await Album.findByPk(AlbumID);
            if(!album) {
                throw new Error("Album tidak ditemukan");
            }
            await album.destroy();
            return new AlbumDto(album)
        } catch (error) {
            throw new Error("Gagal menghapus album: " + error.message);
        }
    }
}

module.exports  = new AlbumRepository();