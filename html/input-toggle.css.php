<?php 
    header("Content-type: text/css");
    $width = $_GET['a'];
?>

.input-toggle {
    position: relative;
    display: inline-block;
    width: <?php echo $width; ?>; /*110px;*/
    height: 34px;
}
.input-toggle input {display:none;}
.input-toggle-slide {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    padding: 8px;
    color: #fff;
}
.input-toggle-slide:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 78px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}
input:checked + .input-toggle-slide {
    background-color: #8CE196;
    padding-left: 40px;
}
input:focus + .input-toggle-slide {
    box-shadow: 0 0 1px #01aeed;
}
input:checked + .input-toggle-slide:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
    left: -20px;
}

.input-toggle-slide.input-toggle-round {
    border-radius: 34px;
}
.input-toggle-slide.input-toggle-round:before {
    border-radius: 50%;
}