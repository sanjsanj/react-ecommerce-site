const Query = {
  dogs(parent, args, ctx, info) {
    return [{ name: "Snickers"}]
  }
};

module.exports = Query;
