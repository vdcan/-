var modal = document.getElementById('myModal');

$(document).ready(function () {
    //$("#open").click(function() {
    //    cover.style.display="block";   //显示遮罩层
    //    //modal.style.display="block";   //显示弹出层
    //})
    //$("#TotalDivCover").click(function() {   //$("#TotalDiv").hide();
    //    $("#TotalDivCover").hide(); // cover.style.display="none";   //隐藏遮罩层
    //    //modal.style.display="none";   //隐藏弹出层
    //})
})

function HideCart() {
    // cover.style.display="block";
    //  $("#TotalDivCover").show();
    modal.style.display = "none";
    //   $("#TotalDiv").show();
}

function ShowCart() {
    // cover.style.display="block";
    //  $("#TotalDivCover").show();
    modal.style.display = "block";
    //   $("#TotalDiv").show();
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function add2(id, price, name, img) {
    add(id, price, name, img, "", "");
}
function add(id, price, name, img, options, opt_prices) {
    console.log(options);
    //simpleCart.add('name='+name, 'price='+price, 'image='+img);
    simpleCart.add({ name: name, price: price, image: img, id: id, pid: id, options: 
    options, opt_prices: opt_prices
    });
    ShowCartTotal();
    console.log("add");

}
function ShowCartTotal() {
    var ids = "";
    var quantity = 0;
    var total = 0;
    simpleCart.each(function (item) {
        //   console.log(item);
        ids += item.get("id") + ",";
        //  price += item.get("price") + ",";
        total += parseFloat(item.get("total"));
        quantity += parseInt(item.get("quantity"));
    });
    if (quantity > 0)
        $("#MyCart").html("(" + quantity + ")");
    else
        $("#MyCart").html("");
    $("#tax").html((total * 0.1).toFixed(2));
    $("#total").html((total * 1.1).toFixed(2));
    console.log(total)
}
//  var  simpleCart = new cart("test");


simpleCart({
    cartColumns: [
      { attr: "image", label: "&nbsp;", view: "image" },
      { attr: "id", label: "id" },
      { attr: "name", label: "Name" },
      { attr: "price", label: "&nbsp;", view: 'currency' },
//{ view: "decrement", label: !1 },
      { attr: "quantity", label: "&nbsp;", view: "input" },
//{ view: "increment", label: !1 },
      { attr: "total", label: "Summe", view: 'currency' },
    //  {view: "remove", text: "x", label: !1}
    ],
    checkout: {
        type: "SendForm",
        url: "/home?mc=checkout",
        extra_data: {
            hash: "PUT_YOUR_FORM_HASH_HERE" // <-- TODO
        }
    }
});

// Configure EURO as currency
simpleCart.currency({
    code: "CAD",
    name: "CAD",
    symbol: "CAD$",
    delimiter: ",",
    decimal: ".",
    after: false,
    accuracy: 2
});
jQuery(function () {


    setTimeout("ShowCartTotal()", 300);
});