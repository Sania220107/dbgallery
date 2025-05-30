const cron = require("node-cron");
const moment = require("moment");
const Foto = require("../../models/foto")
const { Op } = require("sequelize");

cron.schedule("* * * * *", async () => {
  console.log("Memeriksa dan menghapus foto yang lebih dari 30 hari ...");

  const thirtyDaysAgo = moment().subtract(30, "days").toDate();

  try {
    const deletedRows = await Foto.destroy({
      where: {
        deletedAt: { [Op.lte]: thirtyDaysAgo },
      },
      force: true,
    });

    console.log(`Berhasil menghapus ${deletedRows} foto dari sampah.`);
  } catch (error) {
    console.error("Gagal menghapus foto yang sudah dihapus:", error);
  }
});
