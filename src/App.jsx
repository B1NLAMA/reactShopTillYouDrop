// Importing stuff
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Select from 'react-select';
import shoppingcart from '/graphics/shoppingcart.png';
import discountPic from '/graphics/discount.png';
import receipt from '/graphics/receipt.png';
import priceTag from '/graphics/pricetag.png';
import useAsyncFetch from './useAsyncFetch.jsx';

// Making a global variable
let prices = Object();
let school_info = Object();
let value_selected, university, schoolCity, schoolState, tuition, roomAndBoard, total;

// Setting an income values here
const familyIncome = [
  {label: "$0 - $30,000", value:"0-30000"},
  {label: "$30,001 - $48,000", value:"30001-48000"},
  {label: "$48,001 - $75,000", value:"48001-75000"},
  {label: "$75,001 - $110,000", value:"750001-111000"},
  {label: "$110,001 +", value:"110001-plus"}
]

/* App */
function App() {

  // Setting up university selected value to be sent for api request
  const universitySelected = (characterEntered) => {
    console.log(characterEntered);
    university = characterEntered["value"]
    console.log(university);
  };

  const valueSelected = (characterEntered) => {
    console.log(characterEntered);
    value_selected = characterEntered["value"]
    console.log(value_selected);
  };
  
  // Hooks for showing the page
  const [pageName, setPageName] = useState("startPage");

  function shopToPrice() {
    setPageName("pricePage");
  }

  function priceToDiscount() {
    setPageName("discountPage");
  }

  function discountToTotal() {
    setPageName("totalPage");
  }

  function totalToShop() {
    setPageName("startPage");
  }

  console.log(pageName);

  if (pageName == "startPage") {
    
    return (
        <div className="container">
          <h1 className="app-title">SHOP 'TILL YOU DROP</h1>
          <p className="expand">Tuition is only the sticker price - you might be eligible for a big discount! Estimate the <b><em>real</em></b> costs of college, for schools across the crountry</p>
          <img className="circular-img" src={shoppingcart} alt="shopping cart image"/>
          <p className="pick-school-font">Start typing to pick a school</p>
          <div className="selectionbBar">
            <SchoolNames value={universitySelected}/>
            </div>
          <button type="button" className="add-to-cart" onClick={shopToPrice}>ADD TO CART</button>
        </div>
    )
  } else if (pageName == "pricePage") {
    if (university == undefined) {
      university = "Stanford";
    }
    return (
      <div className = "container">

        <h1 className ="price">PRICE</h1>
        <img className = "price-tag-shadow" src = {priceTag} alt = "price tag image"/>
        <p className="price-tag-school">SCHOOL</p>
        <GetSchoolInfo  name={university} />
        <GetPriceInfo name={university} />
        <p className="price-tag-eligible">** YOU MAY BE ELIGIBLE FOR A DISCOUNT!</p>
        <button type="button" className="shop-for-discounts" onClick={priceToDiscount}><b>SHOP FOR DISCOUNTS</b></button>
      </div>
    )
  } else if (pageName == "discountPage") {
    if (university == undefined) {
      university = "Stanford";
    }
    return (
      <div className="container">
        <h1 className="discount">DISCOUNTS</h1>
        <p>Remember, tuition is only the sticker price - you might be eligibile for a big discount!</p>
        <p>Let's see if you qualify for any discounts.</p>
        <img className="circular-img" src={discountPic} alt="Discount Image"></img>
        <label className="inputTitle">Family Income</label>
        <div className="selectionbBar">
          <Select className ="searchbar" 
                options={familyIncome}
                closeMenuOnScroll={false}
                placeholder="Select Income Range" 
                onChange={valueSelected} 
                styles={{ menu: base => ({ ...base, position: 'relative' }) }}/>
        </div>
        <button type="button" className="go" onClick={discountToTotal}>GO</button>
      </div>
    )
  } else if (pageName == "totalPage") {
    
    if (university == undefined) {
      university = "Stanford";
    }
    if (value_selected == undefined) {
      value_selected = "48001-75000";
    }

    let api_calls = "2018.cost.net_price.consumer.by_income_level."+value_selected;
    let totalAfterDiscountedPrice, discountedPrice;

    if (prices[api_calls] == null) {
      totalAfterDiscountedPrice = prices["2018.cost.attendance.academic_year"].toLocaleString();
      discountedPrice = (prices["2018.cost.attendance.academic_year"] - prices["2018.cost.attendance.academic_year"]).toLocaleString();
    } else {
      totalAfterDiscountedPrice = prices[api_calls].toLocaleString();
      discountedPrice = (prices["2018.cost.attendance.academic_year"] - prices[api_calls]).toLocaleString();
    }


    return (
      <div className="container">
        <h1 className="app-title">TOTAL</h1>
        <img className="receipt" src = {receipt} alt = "shopping cart image"/>
        <div className="school-name-location ">
          <p className="school-name-center">{university}</p>
          <p className="school-name-center">{schoolCity}, {schoolState}</p>
          <div className='line '></div>
            <div className="qty-description-amount-title qty-description-amount-font">
              <div className="qty-title-padding">QTY</div>
              <div className="description-title-padding">DESCRIPTION</div>
              <div>AMOUNT</div>
            </div>
          <div className='line'></div>

          <div className="receipt-item-container qty-description-amount-font">
            <div className="qty-description-amount qty-padding">
              <div className="receipt-inbetween-padding">1</div>
              <div>1</div>
            </div>
            <div className="qty-description-amount">
              <div className="receipt-inbetween-padding">TUITION</div>
              <div>FEES, SUPPLIES AND LIVING EXPENSES</div>
            </div>
            <div className="qty-description-amount">
              <div className="receipt-inbetween-padding">${tuition}</div>
              <div>${roomAndBoard}</div>
            </div>
          </div>
          <div className="subtotal-cost qty-description-amount-font">
            <div className="subtotal">SUBTOTAL</div>
            <div>${total}</div>
          </div>
          <div className='line'></div>
          <div className='discount-total-row discount-total-padding'>
            <div><b>DISCOUNT</b></div>
            <div><b>-${discountedPrice}</b></div>
          </div>
          <div className='discount-total-row discount-total-padding'>
            <div>TOTAL</div>
            <div>${totalAfterDiscountedPrice}*</div>
          </div>
          <div className="display">
            <p>*&nbsp;</p>
            <p>This estimate is based on actual costs for families that received federal aid or loans by applying with the FAFSA form. It always pays to ask for a discount!</p>
          </div>
          <div className="conditions">
            <p>Cost includes tuition, living costs, books and supplies, and fees minus the average grants and scholarships for federal financial aid recipients.</p>
            <p>Depending on the federal, state, or institutional grant aid available, students in your income bracket may pay more or less than the overall average costs.</p>
          </div>
        </div>
        <button type="button" className="start-over" onClick={totalToShop}>START OVER</button>
      </div>
    )
  }

}

// Making a fetch request to get the school names
function SchoolNames(props) {
  
  // static var will contain the list of movies
  const [schools, setSchools] = useState([]);

  // Call the custom fetch hook, passing callback functions that we can use
  useAsyncFetch("/query/schoolNames", {}, thenFun, catchFun);

  function thenFun(results) {
    setSchools(results);
    console.log(results)
  }

  function catchFun(error) {
    console.log(error);
  }

  // use the data to do things
  let schoolList = []
  for (let i=0; i < schools.length; i++) {
    let schoolName = schools[i]["school.name"];
    let options = {label: schoolName, value: schoolName};
    schoolList.push(options);
  }

  return (
     <Select className="searchbar"
        isClearable
        placeholder=""
        options={schoolList}
        onChange={props.value}
        closeMenuOnScroll={false}
        styles={{ menu: base => ({ ...base, position: 'relative' }) }} />
  );
}


// Make a fetch request to get the tuition data
function GetPriceInfo(props) {
  
  // static var will contain the list of movies
  const [price, setPrice] = useState(0);

  // Call the custom fetch hook, passing callback functions that we can use
  useAsyncFetch("/query/getCollegeCost?schoolName="+props.name, {}, thenFun, catchFun);
  console.log("got value from async?")

  function thenFun(results) {
    setPrice(results);
    prices = results[0]
  }

  function catchFun(error) {
    console.log(error);
  }

  if (price.length == 1) {
    tuition = price[0]["2018.cost.tuition.in_state"].toLocaleString();
    total = price[0]["2018.cost.attendance.academic_year"].toLocaleString();
    roomAndBoard = (price[0]["2018.cost.attendance.academic_year"] - price[0]["2018.cost.tuition.in_state"]).toLocaleString();
  }
  
  // use the data to do things
  return (
    <>
      <p className="price-tag-tuition">TUITION</p>
      <p className="price-tag-tuition-actual">${tuition}.00</p>
      <p className="price-tag-room-board">ROOM AND BOARD, FEES, SUPPLIES</p>
      <p className="price-tag-room-board-actual">${roomAndBoard}.00</p>
      <div className="price-tag-line"></div>
      <p className="price-tag-retail-price"> TOTAL RETAIL PRICE**</p>
      <p className="price-tag-retail-price-actual">${total}.00</p>
    </>
  );
}

//
function GetSchoolInfo(props) {

  let schoolName = props.name.toUpperCase();

  const [info, setInfo] = useState([])

  // Call the custom fetch hook, passing callback functions that we can use
  useAsyncFetch("/query/getCollegeInfo?schoolName="+schoolName, {}, thenFun, catchFun);
  console.log("got value from async")

  function thenFun(results) {
    setInfo(results)
    school_info = results[0];
  }
  
  function catchFun(error) {
    console.log(error);
  }

  console.log(info)
  if (info.length == 1) {
    schoolCity = info[0]["school.city"].toUpperCase();
    console.log(schoolCity);
    schoolState = info[0]["school.state"].toUpperCase();
    console.log(schoolState);
    console.log(info)
  }

  return (
    <>
      <p className="price-tag-schoolname">{schoolName} <br/> {schoolCity}, {schoolState}</p>
    </>
  )
}

export default App;