<?php

require 'vendor/autoload.php'; // Include Composer's autoload file

use Jameshightower\Mod7\MyClass;

$myClassInstance = new MyClass();
echo $myClassInstance->sayHello(); // This should output: Hello from MyClass!